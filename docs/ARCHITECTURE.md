# FluffyPet Platform Architecture

## Overview

FluffyPet is a comprehensive, multi-tenant pet care management platform built with Next.js 14 and Supabase. The platform serves multiple user types including pet owners, veterinarians, service providers, NGOs, breeders, and platform administrators through role-based dashboards and specialized workflows.

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4.0
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks and server state
- **Authentication**: Supabase Auth with role-based access control

### Backend & Database
- **Database**: Supabase PostgreSQL (141+ tables)
- **Authentication**: Supabase Auth with JWT + RLS
- **Real-time**: Supabase Realtime subscriptions
- **File Storage**: Supabase Storage (secure buckets)
- **API**: Supabase Edge Functions (Deno runtime)
- **Serverless Functions**: Next.js API routes for development utilities

### Infrastructure
- **Hosting**: Vercel (Frontend)
- **Backend**: Supabase (Fully managed)
- **Edge Computing**: Supabase Edge Functions (Global deployment)
- **Analytics**: Vercel Analytics & Speed Insights
- **Monitoring**: Built-in error tracking and performance monitoring

## Architecture Patterns

### Multi-Tenancy with Supabase
The platform implements a multi-tenant architecture where:
- Organizations serve as tenant boundaries
- Users can belong to multiple organizations
- Data isolation through Supabase Row Level Security (RLS)
- Role-based permissions within each organization

### Authentication & Authorization Flow
\`\`\`
User → Supabase Auth → Profile Creation → Organization Membership → Role-based Access
\`\`\`
- Supabase Auth handles user authentication (email, OAuth)
- Automatic profile creation via database triggers
- Organization membership defines access scope
- Granular permissions through RLS policies

### Data Security with Supabase
- Row Level Security (RLS) on all 141+ tables
- Secure UUID-based entity identification
- Supabase Storage with signed URLs for media access
- Comprehensive audit logging
- GDPR/CCPA compliance features

## Core Modules

### 1. User Management & Authentication
**Location**: `components/auth/`, `supabase/functions/auth/`

Features:
- Email/password authentication via Supabase Auth
- Social authentication (Google, GitHub)
- Role-based user onboarding
- Multi-organization membership
- Session management with Next.js middleware

**Supabase Integration**:
- Auth triggers for profile creation
- RLS policies for user data isolation
- Edge functions for complex auth flows

### 2. Pet Profile Management
**Location**: `app/pets/`, `components/pets/`

Features:
- Comprehensive pet profiles with medical history
- Media management via Supabase Storage
- Sharing permissions and collaborators
- Health tracking and reminders
- AI-powered insights

**Supabase Integration**:
- Pet data stored in PostgreSQL with RLS
- Media files in Supabase Storage buckets
- Real-time updates via Supabase Realtime

### 3. Real-time Communication System
**Location**: `components/chat/`, `supabase/functions/chat/`

Features:
- Real-time messaging via Supabase Realtime
- Booking-context conversations
- File sharing through Supabase Storage
- Notification system integration
- Presence indicators

**Supabase Integration**:
- WebSocket connections via Supabase Realtime
- Message storage in PostgreSQL
- Edge functions for message processing

### 4. Booking & Appointment System
**Location**: `components/booking/`, Database tables: `bookings`, `appointments`

Features:
- Service provider discovery
- Real-time booking management
- Payment integration (Razorpay)
- Calendar scheduling
- Automated notifications

**Supabase Integration**:
- Real-time booking updates
- RLS for multi-tenant booking isolation
- Edge functions for payment processing

### 5. Multi-Role Dashboard System
**Location**: `app/dashboard/`, `components/dashboard/`

Role-specific dashboards powered by Supabase:
- **Pet Owners**: Pet management, bookings, health tracking
- **Veterinarians**: Patient records, appointments, medical notes
- **Service Providers**: Booking management, client communication
- **Clinic Admins**: Staff management, compliance tracking
- **NGO Admins**: Animal rescue, adoption workflows
- **Platform Admins**: System oversight, user management

### 6. E-commerce Platform
**Location**: `app/shop/`, `components/shop/`

Features:
- Multi-vendor marketplace
- Product catalog management
- Shopping cart and checkout
- Order management
- Inventory tracking

**Supabase Integration**:
- Product data in PostgreSQL
- Order processing via Edge functions
- Real-time inventory updates

### 7. Community Features
**Location**: Database tables: `community_posts`, `forum_posts`

Features:
- Community forums and discussions
- Lost & found pet reporting
- Breeding network and matching
- Event management
- Social interactions (likes, comments)

**Supabase Integration**:
- Real-time community updates
- Media sharing via Supabase Storage
- Advanced search with PostgreSQL full-text search

## Supabase Architecture

### Database Schema (141+ Tables)

#### Core Entity Relationships
\`\`\`
Users (auth.users)
├── Profiles (public.profiles)
├── Organization Memberships (organization_users)
├── Pet Ownership (pets)
└── Audit Trail (audit_logs)

Organizations
├── Services (services)
├── Staff (organization_users)
├── Bookings (bookings)
└── Analytics (analytics_org_summary)

Pets
├── Medical Records (medical_records)
├── Media Files (pet_media) → Supabase Storage
├── Collaborators (pet_collaborators)
└── Sharing (pet_shares)
\`\`\`

### Supabase Storage Buckets
\`\`\`
Storage Architecture:
├── pet-media (Private bucket)
│   ├── Pet photos and documents
│   ├── Medical records and X-rays
│   └── Signed URLs for secure access
├── org-media (Private bucket)
│   ├── Organization branding
│   ├── Staff photos
│   └── Certificates and licenses
└── public-assets (Public bucket)
    ├── Platform assets
    ├── Default avatars
    └── Marketing materials
\`\`\`

### Supabase Edge Functions
\`\`\`
Edge Functions Architecture:
├── auth/index.ts          # Authentication logic
├── media/index.ts         # File processing & optimization
├── chat/index.ts          # Real-time messaging
├── ai/index.ts            # AI integrations
├── payments/index.ts      # Payment processing
└── _shared/
    ├── cors.ts            # CORS handling
    ├── monitoring.ts      # Performance monitoring
    └── auth.ts            # Auth utilities
\`\`\`

### Supabase Realtime Channels
\`\`\`
Real-time Subscriptions:
├── chat:{conversation_id}     # Message updates
├── bookings:{org_id}          # Booking status changes
├── pets:{pet_id}              # Pet profile updates
├── notifications:{user_id}    # User notifications
└── presence:{room_id}         # User presence
\`\`\`

## File Structure

\`\`\`
fluffypet/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── admin/                    # Platform admin interface
│   ├── dashboard/                # Role-based dashboards
│   ├── pets/                     # Pet management
│   ├── shop/                     # E-commerce
│   ├── api/                      # Next.js API routes (dev utilities)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── pets/                     # Pet-related components
│   ├── chat/                     # Real-time chat components
│   ├── admin/                    # Admin components
│   ├── ui/                       # UI component library
│   └── mobile/                   # Mobile-specific components
├── lib/                          # Utility libraries
│   ├── actions/                  # Server actions
│   ├── hooks/                    # Custom React hooks
│   ├── types/                    # TypeScript definitions
│   ├── supabase-client.ts        # Supabase browser client
│   └── supabase-server.ts        # Supabase server client
├── supabase/                     # Supabase configuration
│   ├── functions/                # Edge Functions
│   │   ├── auth/                 # Authentication functions
│   │   ├── media/                # Media processing
│   │   ├── chat/                 # Chat functions
│   │   └── _shared/              # Shared utilities
│   └── config.toml               # Supabase configuration
├── scripts/                      # Database scripts
│   └── sql/                      # SQL migration files
└── docs/                         # Documentation
\`\`\`

## Security Implementation

### Supabase Authentication Flow
1. User signs up/in via Supabase Auth
2. Profile created automatically via database trigger
3. Role assignment and organization membership
4. JWT token with custom claims
5. Next.js middleware validates routes and permissions

### Data Protection with Supabase
- All sensitive data encrypted at rest in Supabase
- Secure media URLs with Supabase Storage signed URLs
- API rate limiting via Supabase Edge Functions
- Input validation and sanitization
- CSRF protection on forms

### Row Level Security (RLS)
\`\`\`sql
-- Example: Multi-tenant pet access
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

## Performance Optimizations

### Frontend
- Server-side rendering (SSR) for SEO
- Static generation where appropriate
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Efficient bundle sizes

### Supabase Backend
- Optimized queries with proper indexing
- Connection pooling via Supabase
- Edge Functions for global performance
- Real-time subscriptions for live updates
- Efficient pagination patterns

### Infrastructure
- Vercel Edge Network for frontend distribution
- Supabase global edge network for backend
- Automatic scaling based on demand
- CDN for static assets via Supabase Storage
- Performance monitoring and alerts

## Deployment & DevOps

### Environment Management
\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_REF=your-project-ref

# Additional Services
RESEND_API_KEY=your-resend-key
RAZORPAY_KEY_ID=your-razorpay-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
\`\`\`

### Deployment Pipeline
\`\`\`bash
# Frontend deployment (Vercel)
vercel deploy --prod

# Edge Functions deployment (Supabase)
supabase functions deploy --project-ref your-project-ref

# Database migrations
supabase db push --project-ref your-project-ref
\`\`\`

### Monitoring & Observability
- Supabase Dashboard for database monitoring
- Edge Functions logs and metrics
- Vercel Analytics for frontend performance
- Real-time error tracking
- User analytics and insights

This architecture leverages Supabase's comprehensive platform to provide secure, scalable, and real-time pet care management while maintaining strict data privacy and multi-tenant isolation. The combination of Supabase's managed services with Next.js provides a robust foundation for the FluffyPet platform.
