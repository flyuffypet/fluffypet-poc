# Supabase Integration Guide

## Overview

FluffyPet leverages Supabase as a comprehensive backend-as-a-service platform, utilizing multiple Supabase services for a complete solution:

- **Supabase Database** - PostgreSQL with Row Level Security (RLS)
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File and media storage
- **Supabase Realtime** - Real-time subscriptions and chat
- **Supabase Edge Functions** - Serverless functions at the edge

## Architecture Overview

\`\`\`
Frontend (Next.js)
├── Supabase Client (Browser)
├── Supabase Server Client (SSR)
└── Edge Functions (API Logic)

Supabase Backend
├── PostgreSQL Database (141+ tables)
├── Auth Service (JWT + RLS)
├── Storage Buckets (Media files)
├── Realtime Engine (WebSockets)
└── Edge Functions (Deno runtime)
\`\`\`

## 1. Database Integration

### Connection Setup
\`\`\`typescript
// lib/supabase-client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase-server.ts - Server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createServerClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}
\`\`\`

### Row Level Security (RLS)
All tables implement comprehensive RLS policies:

\`\`\`sql
-- Example: Pet access control
CREATE POLICY "Users can view own pets" ON pets
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Organization members can view org pets" ON pets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_users ou
      WHERE ou.user_id = auth.uid()
      AND ou.organization_id = pets.organization_id
      AND ou.status = 'active'
    )
  );
\`\`\`

## 2. Authentication Integration

### Auth Flow
\`\`\`typescript
// Authentication with profile creation
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    data: {
      full_name: fullName,
    }
  }
})

// Automatic profile creation via database trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'pet_owner'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

### Role-Based Access Control
\`\`\`typescript
// Role guard component
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, role } = useAuth()
  
  if (!user || !allowedRoles.includes(role)) {
    return <AccessDenied />
  }
  
  return <>{children}</>
}
\`\`\`

## 3. Supabase Storage Integration

### Storage Buckets Configuration
\`\`\`sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('pet-media', 'pet-media', false),
  ('org-media', 'org-media', false),
  ('public-assets', 'public-assets', true);

-- Storage policies
CREATE POLICY "Users can upload pet media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'pet-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own pet media" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'pet-media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
\`\`\`

### File Upload Implementation
\`\`\`typescript
// components/media/media-uploader.tsx
export async function uploadFile(file: File, petId: string) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${petId}/${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('pet-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (error) throw error
  
  // Get signed URL for secure access
  const { data: signedUrl } = await supabase.storage
    .from('pet-media')
    .createSignedUrl(data.path, 60 * 60 * 24) // 24 hours
  
  return {
    path: data.path,
    url: signedUrl?.signedUrl
  }
}
\`\`\`

### Media Access Control
\`\`\`typescript
// Secure media access with signed URLs
export async function getSecureMediaUrl(path: string, expiresIn = 3600) {
  const supabase = createClient()
  
  const { data, error } = await supabase.storage
    .from('pet-media')
    .createSignedUrl(path, expiresIn)
  
  if (error) throw error
  return data.signedUrl
}
\`\`\`

## 4. Supabase Realtime Integration

### Real-time Chat System
\`\`\`typescript
// hooks/use-realtime-chat.ts
export function useRealtimeChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()
  
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, supabase])
  
  return { messages, sendMessage }
}
\`\`\`

### Real-time Booking Updates
\`\`\`typescript
// Real-time booking status updates
export function useRealtimeBookings(organizationId: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const supabase = createClient()
  
  useEffect(() => {
    const channel = supabase
      .channel('bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `organization_id=eq.${organizationId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [...prev, payload.new as Booking])
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => 
              prev.map(booking => 
                booking.id === payload.new.id 
                  ? payload.new as Booking 
                  : booking
              )
            )
          }
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [organizationId, supabase])
  
  return bookings
}
\`\`\`

## 5. Supabase Edge Functions

### Edge Functions Architecture
\`\`\`
supabase/functions/
├── auth/index.ts          # Authentication logic
├── media/index.ts         # File processing
├── chat/index.ts          # Real-time messaging
├── ai/index.ts            # AI integrations
└── _shared/
    ├── cors.ts            # CORS handling
    └── monitoring.ts      # Performance monitoring
\`\`\`

### Authentication Edge Function
\`\`\`typescript
// supabase/functions/auth/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { email, password, action } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  
  if (action === 'signup') {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(JSON.stringify({ user: data.user }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Handle other auth actions...
})
\`\`\`

### Media Processing Edge Function
\`\`\`typescript
// supabase/functions/media/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { action, file, petId } = await req.json()
  
  if (action === 'process-image') {
    // Image processing logic
    const processedImage = await processImage(file)
    
    // Store in Supabase Storage
    const { data, error } = await supabase.storage
      .from('pet-media')
      .upload(`${petId}/${Date.now()}.jpg`, processedImage)
    
    if (error) throw error
    
    return new Response(JSON.stringify({ 
      success: true, 
      path: data.path 
    }))
  }
})
\`\`\`

## 6. Environment Configuration

### Required Environment Variables
\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_REF=your-project-ref

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres

# Storage
SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1

# Edge Functions
SUPABASE_FUNCTIONS_URL=https://your-project.supabase.co/functions/v1
\`\`\`

## 7. Deployment and Monitoring

### Edge Functions Deployment
\`\`\`bash
# Deploy all functions
supabase functions deploy --project-ref your-project-ref

# Deploy specific function
supabase functions deploy auth --project-ref your-project-ref

# Set environment variables
supabase secrets set --project-ref your-project-ref API_KEY=your-key
\`\`\`

### Performance Monitoring
\`\`\`typescript
// Built-in monitoring for Edge Functions
export async function withMonitoring(handler: Function) {
  const start = Date.now()
  
  try {
    const result = await handler()
    const duration = Date.now() - start
    
    // Log performance metrics
    console.log(`Function executed in ${duration}ms`)
    
    return result
  } catch (error) {
    // Log errors
    console.error('Function error:', error)
    throw error
  }
}
\`\`\`

## 8. Security Best Practices

### Database Security
- All tables have RLS enabled
- Service role key only used in Edge Functions
- Anon key used for client-side operations
- Regular security audits via audit_logs table

### Storage Security
- Private buckets for sensitive media
- Signed URLs for temporary access
- File type validation
- Size limits enforced

### Real-time Security
- Channel-level authorization
- Message encryption in transit
- Rate limiting on subscriptions
- User presence validation

This comprehensive Supabase integration provides a secure, scalable, and feature-rich backend for the FluffyPet platform, leveraging the full power of Supabase's ecosystem.
\`\`\`

Now let's update the main architecture documentation:
