# FluffyPet Platform Deployment Guide

This guide covers deploying the FluffyPet platform to production with proper authentication configuration.

## Prerequisites

- Vercel account (recommended) or other hosting platform
- Supabase project configured
- Domain name (optional but recommended)
- Environment variables ready

## Environment Configuration

### Production Environment Variables

Ensure these environment variables are set in your production environment:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Email Service
RESEND_API_KEY=your-resend-api-key

# Notifications
NOVU_API_KEY=your-novu-api-key
NEXT_PUBLIC_NOVU_APP_ID=your-novu-app-id

# Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-google-maps-map-id

# AI Integration
OPENAI_API_KEY=your-openai-api-key

# Security
CRON_SECRET=your-cron-secret
\`\`\`

### Supabase Dashboard Configuration

1. **Authentication > URL Configuration**:
   - Site URL: `https://your-domain.com`
   - Redirect URLs:
     - `https://your-domain.com/auth/callback`
     - `https://your-domain.com/**`
     - `https://*.vercel.app/auth/callback` (for preview deployments)
     - `https://*.vercel.app/**` (for preview deployments)
     - `http://localhost:3000/auth/callback` (for local development)
     - `http://localhost:3000/**` (for local development)

2. **Authentication > Email Templates**:
   Update all email templates to use the correct callback URL format.

3. **Row Level Security**:
   Ensure RLS is enabled on all tables:

   \`\`\`sql
   -- Enable RLS on all tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
   ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
   -- ... etc for all tables
   \`\`\`

## Vercel Deployment

1. **Connect Repository**

   \`\`\`bash
   # Install Vercel CLI
   npm i -g vercel

   # Login to Vercel
   vercel login

   # Deploy from project directory
   vercel
   \`\`\`

2. **Configure Environment Variables**

   In Vercel Dashboard:
   1. Go to your project settings
   2. Navigate to "Environment Variables"
   3. Add all required variables listed above
   4. Set appropriate environments (Production, Preview, Development)

3. **Configure Domains**

   1. In Vercel Dashboard, go to "Domains"
   2. Add your custom domain
   3. Configure DNS records as instructed
   4. Update `NEXT_PUBLIC_SITE_URL` to match your domain

4. **Configure Build Settings**

   \`\`\`json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "nextjs",
     "regions": ["iad1", "sfo1"],
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   \`\`\`

## Database Migration

1. **Run Migrations**

   \`\`\`bash
   # Run database migrations
   npm run db:migrate

   # Seed initial data (optional)
   npm run db:seed
   \`\`\`

2. **Verify Database Schema**

   Check that all tables, indexes, and policies are created correctly:

   \`\`\`sql
   -- Check tables
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';

   -- Check RLS policies
   SELECT schemaname, tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public';
   \`\`\`

## Security Configuration

1. **Configure CORS**

   In Supabase Dashboard → Settings → API:
   - Add your domain to allowed origins
   - Configure appropriate CORS settings

2. **Set Up Rate Limiting**

   Configure rate limits in Supabase:
   - Email signup: 3 per hour
   - SMS signup: 3 per hour  
   - Email signin: 6 per hour

3. **Enable Security Features**

   - Enable email confirmations
   - Enable double confirm for email changes
   - Configure JWT expiry (recommended: 1 hour)
   - Enable refresh token rotation

## Performance Optimization

1. **Configure Caching**

   \`\`\`typescript
   // next.config.mjs
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       turbo: {
         rules: {
           '*.svg': {
             loaders: ['@svgr/webpack'],
             as: '*.js',
           },
         },
       },
     },
     images: {
       domains: ['your-supabase-project.supabase.co'],
       formats: ['image/webp', 'image/avif'],
     },
     headers: async () => [
       {
         source: '/(.*)',
         headers: [
           {
             key: 'X-Frame-Options',
             value: 'DENY',
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff',
           },
           {
             key: 'Referrer-Policy',
             value: 'origin-when-cross-origin',
           },
         ],
       },
     ],
   }

   export default nextConfig
   \`\`\`

2. **Enable Analytics**

   \`\`\`typescript
   // app/layout.tsx
   import { Analytics } from '@vercel/analytics/react'
   import { SpeedInsights } from '@vercel/speed-insights/next'

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body>
           {children}
           <Analytics />
           <SpeedInsights />
         </body>
       </html>
     )
   }
   \`\`\`

## Monitoring and Logging

1. **Set Up Error Tracking**

   Configure error boundaries and logging:

   \`\`\`typescript
   // lib/logger.ts
   export function logError(error: Error, context?: string) {
     console.error(`[${context}]`, error)
     // Add external error tracking service here
   }
   \`\`\`

2. **Monitor Performance**

   - Use Vercel Analytics for performance monitoring
   - Monitor Supabase logs for database issues
   - Set up uptime monitoring

## Testing Production Deployment

1. **Functional Testing**

   \`\`\`bash
   # Test authentication flow
   curl -X POST https://your-domain.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'

   # Test API endpoints
   curl https://your-domain.com/api/health
   \`\`\`

2. **Load Testing**

   Use tools like:
   - Artillery.io for API load testing
   - Lighthouse for performance testing
   - WebPageTest for comprehensive analysis

## Rollback Strategy

1. **Vercel Rollback**

   \`\`\`bash
   # List deployments
   vercel ls

   # Rollback to previous deployment
   vercel rollback [deployment-url]
   \`\`\`

2. **Database Rollback**

   Keep database migration rollback scripts:

   \`\`\`sql
   -- Example rollback script
   -- rollback_001_initial_schema.sql
   DROP TABLE IF EXISTS pets CASCADE;
   DROP TABLE IF EXISTS profiles CASCADE;
   -- ... etc
   \`\`\`

## Production Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Authentication flow tested
- [ ] Email templates updated
- [ ] OAuth providers configured
- [ ] Security settings enabled
- [ ] Performance optimizations applied

### Post-Deployment
- [ ] Domain configured and SSL active
- [ ] Authentication working end-to-end
- [ ] Email confirmations working
- [ ] Password reset working
- [ ] OAuth signin working (if enabled)
- [ ] Database queries performing well
- [ ] Error tracking configured
- [ ] Monitoring set up
- [ ] Backup strategy in place

### Ongoing Maintenance
- [ ] Monitor error logs daily
- [ ] Review performance metrics weekly
- [ ] Update dependencies monthly
- [ ] Review security settings quarterly
- [ ] Test backup/restore procedures quarterly

## Troubleshooting

### Common Issues

**1. Authentication redirects failing**
- Check Supabase redirect URLs
- Verify NEXT_PUBLIC_SITE_URL is correct
- Test with curl/Postman

**2. Database connection issues**
- Verify Supabase credentials
- Check connection pooling settings
- Monitor connection limits

**3. Email delivery problems**
- Check Resend API key and domain
- Verify email templates
- Check spam folders

**4. Performance issues**
- Review database query performance
- Check image optimization
- Monitor bundle size

### Support Resources

- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- FluffyPet Support: [Your support channel]

---

**Last Updated:** December 2024
**Version:** 1.0
