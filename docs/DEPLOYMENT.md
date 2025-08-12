# Deployment Guide

## Environment Configuration

### Production Environment Variables

Ensure these environment variables are set in your production environment:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration (CRITICAL)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Other required variables
BLOB_READ_WRITE_TOKEN=your-blob-token
RESEND_API_KEY=your-resend-key
NOVU_API_KEY=your-novu-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your-google-maps-map-id
\`\`\`

### Supabase Dashboard Configuration

1. **Authentication > URL Configuration**:
   - Site URL: `https://your-domain.com`
   - Redirect URLs:
     - `https://your-domain.com/auth/callback`
     - `https://your-domain.com/**`
     - `https://*-your-team.vercel.app/auth/callback` (for preview deployments)
     - `https://*-your-team.vercel.app/**` (for preview deployments)

2. **Authentication > Email Templates**:
   Update all email templates to use the correct callback URL format.

### Vercel Deployment

1. **Environment Variables**: Set all required environment variables in Vercel dashboard
2. **Domain Configuration**: Configure your custom domain
3. **Preview Deployments**: Ensure preview deployments can authenticate

### Testing Checklist

- [ ] Production authentication works
- [ ] Email confirmations work
- [ ] Password reset works
- [ ] OAuth providers work
- [ ] Preview deployments work
- [ ] All redirect URLs are HTTPS
