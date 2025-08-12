# FluffyPet Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Database Management](#database-management)
4. [Authentication & Authorization](#authentication--authorization)
5. [Component Development](#component-development)
6. [API Development](#api-development)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- Vercel account (for deployment)

### Initial Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd fluffypet
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Configuration**
   Copy the environment variables and configure:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Required environment variables:
   \`\`\`env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Vercel Blob
   BLOB_READ_WRITE_TOKEN=your_blob_token
   
   # Payment Gateway
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # Email Service
   RESEND_API_KEY=your_resend_key
   
   # Google Maps (optional)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key
   \`\`\`

4. **Database Setup**
   Run the SQL migration scripts in order:
   \`\`\`bash
   # Execute scripts in /scripts/sql/ directory
   # Start with 001_create_media_type.sql and follow numerical order
   \`\`\`

5. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Development Environment

### Project Structure
\`\`\`
fluffypet/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   ├── admin/             # Admin interface
│   ├── dashboard/         # Role-based dashboards
│   ├── pets/              # Pet management
│   ├── shop/              # E-commerce
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── dashboard/        # Dashboard components
│   ├── pets/             # Pet-related
│   ├── admin/            # Admin components
│   ├── ui/               # UI library
│   └── mobile/           # Mobile-specific
├── lib/                  # Utilities
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript types
│   └── utils.ts          # Helper functions
├── scripts/              # Database scripts
└── docs/                 # Documentation
\`\`\`

### Development Workflow

1. **Feature Development**
   - Create feature branch from main
   - Follow component-driven development
   - Write tests for new functionality
   - Update documentation

2. **Code Standards**
   - TypeScript strict mode enabled
   - ESLint and Prettier configured
   - Consistent naming conventions
   - Component and function documentation

3. **Git Workflow**
   \`\`\`bash
   git checkout -b feature/new-feature
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   \`\`\`

## Database Management

### Schema Overview

The database consists of 141+ tables organized into functional areas:

#### Core Tables
- `profiles` - User profile information
- `organizations` - Multi-tenant organizations
- `organization_users` - User-organization relationships
- `pets` - Pet profiles and information
- `appointments` - Veterinary appointments
- `bookings` - Service bookings
- `payments` - Payment transactions

#### Specialized Modules
- **Medical**: `medical_records`, `reminders`, `ai_insights`
- **Communication**: `conversations`, `messages`, `notifications`
- **E-commerce**: `products`, `orders`, `cart_items`
- **Community**: `community_posts`, `forum_posts`, `comments`
- **Lost & Found**: `lf_reports`, `lf_matches`, `lf_media`
- **Breeding**: `breeding_profiles`, `breeding_matches`, `breeding_requests`
- **Livestock**: `livestock`, `livestock_batches`, `feed_logs`

### Database Operations

#### Running Migrations
\`\`\`bash
# Execute SQL files in order
psql -h your-host -d your-db -f scripts/sql/001_create_media_type.sql
\`\`\`

#### Creating New Tables
1. Create SQL file in `scripts/sql/` with incremental number
2. Include table creation, indexes, and RLS policies
3. Add to migration sequence
4. Update TypeScript types in `lib/types/`

#### Row Level Security (RLS)
All tables implement RLS policies:
\`\`\`sql
-- Example RLS policy
CREATE POLICY "Users can view own pets" ON pets
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Organization members can view org pets" ON pets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_users ou
      WHERE ou.user_id = auth.uid()
      AND ou.organization_id = pets.organization_id
    )
  );
\`\`\`

### Database Functions

Key stored procedures and functions:

#### User Management
- `handle_new_user()` - Trigger for new user profile creation
- `update_user_role()` - Role assignment function
- `get_user_organizations()` - Fetch user's organizations

#### Analytics
- `refresh_all_org_summaries()` - Update organization analytics
- `calculate_platform_metrics()` - Platform-wide statistics
- `generate_user_insights()` - User activity analysis

#### Audit & Security
- `log_security_event()` - Security event logging
- `audit_data_access()` - Data access tracking
- `cleanup_expired_tokens()` - Token maintenance

## Authentication & Authorization

### Supabase Auth Integration

#### Client Setup
\`\`\`typescript
// lib/supabase-client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
\`\`\`

#### Server Setup
\`\`\`typescript
// lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}
\`\`\`

### Role-Based Access Control

#### User Roles
\`\`\`typescript
type UserRole = 
  | 'pet_owner'
  | 'veterinarian' 
  | 'service_provider'
  | 'clinic_admin'
  | 'ngo_admin'
  | 'platform_admin'
  | 'volunteer'
  | 'breeder'
  | 'seller'
\`\`\`

#### Role Guards
\`\`\`typescript
// components/auth/role-guard.tsx
interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, role } = useAuth()
  
  if (!user || !allowedRoles.includes(role)) {
    return fallback || <AccessDenied />
  }
  
  return <>{children}</>
}
\`\`\`

### Middleware Protection
\`\`\`typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* config */)
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session || !isAdmin(session.user)) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}
\`\`\`

## Component Development

### Component Guidelines

#### 1. Component Structure
\`\`\`typescript
// components/example/example-component.tsx
interface ExampleComponentProps {
  title: string
  onAction?: () => void
  children?: React.ReactNode
}

export function ExampleComponent({ 
  title, 
  onAction, 
  children 
}: ExampleComponentProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
      {onAction && (
        <Button onClick={onAction}>Action</Button>
      )}
    </div>
  )
}
\`\`\`

#### 2. Custom Hooks
\`\`\`typescript
// lib/hooks/use-pets.ts
export function usePets(ownerId?: string) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchPets() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', ownerId)
        
        if (error) throw error
        setPets(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (ownerId) fetchPets()
  }, [ownerId])
  
  return { pets, loading, error, refetch: fetchPets }
}
\`\`\`

#### 3. Server Actions
\`\`\`typescript
// lib/actions/pet-actions.ts
'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function createPet(formData: FormData) {
  const supabase = createServerClient()
  
  const petData = {
    name: formData.get('name') as string,
    species: formData.get('species') as string,
    breed: formData.get('breed') as string,
    // ... other fields
  }
  
  const { data, error } = await supabase
    .from('pets')
    .insert(petData)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create pet: ${error.message}`)
  }
  
  revalidatePath('/pets')
  return data
}
\`\`\`

### UI Component Development

#### Using shadcn/ui
\`\`\`bash
# Add new UI components
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add table
\`\`\`

#### Custom Component Example
\`\`\`typescript
// components/ui/data-table.tsx
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ 
  data, 
  columns, 
  onRowClick 
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow 
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className="cursor-pointer hover:bg-muted/50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
\`\`\`

## API Development

### Route Handlers
\`\`\`typescript
// app/api/pets/route.ts
import { createServerClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { data: pets, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', session.user.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ pets })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const petData = {
      ...body,
      owner_id: session.user.id,
      created_at: new Date().toISOString()
    }
    
    const { data: pet, error } = await supabase
      .from('pets')
      .insert(petData)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ pet }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
\`\`\`

### Real-time Subscriptions
\`\`\`typescript
// lib/hooks/use-realtime-bookings.ts
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
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => 
              prev.filter(booking => booking.id !== payload.old.id)
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

## Testing

### Unit Testing
\`\`\`typescript
// __tests__/components/pet-card.test.tsx
import { render, screen } from '@testing-library/react'
import { PetCard } from '@/components/pets/pet-card'

const mockPet = {
  id: '1',
  name: 'Fluffy',
  species: 'dog',
  breed: 'Golden Retriever',
  age: 3
}

describe('PetCard', () => {
  it('renders pet information correctly', () => {
    render(<PetCard pet={mockPet} />)
    
    expect(screen.getByText('Fluffy')).toBeInTheDocument()
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument()
    expect(screen.getByText('3 years old')).toBeInTheDocument()
  })
  
  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn()
    render(<PetCard pet={mockPet} onEdit={onEdit} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    editButton.click()
    
    expect(onEdit).toHaveBeenCalledWith(mockPet)
  })
})
\`\`\`

### Integration Testing
\`\`\`typescript
// __tests__/api/pets.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/pets/route'

describe('/api/pets', () => {
  it('returns pets for authenticated user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        authorization: 'Bearer valid-token'
      }
    })
    
    await handler(req, res)
    
    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data.pets).toBeDefined()
  })
})
\`\`\`

### E2E Testing
\`\`\`typescript
// e2e/pet-management.spec.ts
import { test, expect } from '@playwright/test'

test('user can create a new pet', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  
  await page.goto('/pets/new')
  await page.fill('[name="name"]', 'Test Pet')
  await page.selectOption('[name="species"]', 'dog')
  await page.fill('[name="breed"]', 'Test Breed')
  
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/pets')
  await expect(page.locator('text=Test Pet')).toBeVisible()
})
\`\`\`

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings
   - Set environment variables

2. **Environment Variables**
   \`\`\`bash
   # Production environment variables
   NEXT_PUBLIC_SUPABASE_URL=prod_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_key
   SUPABASE_SERVICE_ROLE_KEY=prod_service_key
   # ... other production variables
   \`\`\`

3. **Build Configuration**
   \`\`\`json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   \`\`\`

### Database Deployment

1. **Production Database Setup**
   - Create production Supabase project
   - Run migration scripts in order
   - Configure RLS policies
   - Set up backup schedules

2. **Migration Strategy**
   \`\`\`bash
   # Run migrations on production
   npm run migrate:prod
   
   # Verify database state
   npm run db:verify
   \`\`\`

## Troubleshooting

### Common Issues

#### 1. Authentication Errors
\`\`\`typescript
// Debug authentication issues
const debugAuth = async () => {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  console.log('Session:', session)
  console.log('Error:', error)
  
  if (!session) {
    console.log('No active session - user needs to login')
  }
}
\`\`\`

#### 2. Database Connection Issues
\`\`\`sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify user permissions
SELECT auth.uid(), auth.role();
\`\`\`

#### 3. Real-time Subscription Issues
\`\`\`typescript
// Debug real-time connections
const debugRealtime = () => {
  const supabase = createClient()
  
  const channel = supabase
    .channel('debug')
    .on('broadcast', { event: 'test' }, (payload) => {
      console.log('Received:', payload)
    })
    .subscribe((status) => {
      console.log('Subscription status:', status)
    })
    
  // Test broadcast
  channel.send({
    type: 'broadcast',
    event: 'test',
    payload: { message: 'Hello' }
  })
}
\`\`\`

### Performance Optimization

#### 1. Database Queries
\`\`\`typescript
// Optimize queries with proper indexing
const optimizedQuery = await supabase
  .from('pets')
  .select(`
    id,
    name,
    species,
    medical_records!inner(
      id,
      title,
      recorded_at
    )
  `)
  .eq('owner_id', userId)
  .order('created_at', { ascending: false })
  .limit(10)
\`\`\`

#### 2. Component Optimization
\`\`\`typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveCalculation(item)
    }))
  }, [data])
  
  return <div>{/* render processed data */}</div>
})
\`\`\`

#### 3. Image Optimization
\`\`\`typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={pet.photo_url || "/placeholder.svg"}
  alt={pet.name}
  width={300}
  height={200}
  priority={isPriority}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
\`\`\`

This developer guide provides comprehensive information for working with the FluffyPet platform, covering everything from initial setup to advanced optimization techniques.
