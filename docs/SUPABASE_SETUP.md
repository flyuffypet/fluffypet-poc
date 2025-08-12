# Supabase Configuration Guide for FluffyPet

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your FluffyPet project

## Step 2: Configure Authentication Settings

### Navigate to Authentication Settings
1. In the left sidebar, click **Authentication**
2. Click on **URL Configuration**

### Set Site URL
1. In the **Site URL** field, enter your production domain:
   \`\`\`
   https://your-production-domain.com
   \`\`\`
   
   For development, use:
   \`\`\`
   http://localhost:3000
   \`\`\`

### Configure Redirect URLs
In the **Redirect URLs** section, add these URLs (one per line):

#### For Production:
\`\`\`
https://your-production-domain.com/auth/callback
https://your-production-domain.com/**
\`\`\`

#### For Staging (if you have a staging environment):
\`\`\`
https://staging.your-domain.com/auth/callback
https://staging.your-domain.com/**
\`\`\`

#### For Development:
\`\`\`
http://localhost:3000/auth/callback
http://localhost:3000/**
\`\`\`

#### For Vercel Preview Deployments:
\`\`\`
https://*-your-team-name.vercel.app/auth/callback
https://*-your-team-name.vercel.app/**
\`\`\`

## Step 3: Configure Email Templates

### Navigate to Email Templates
1. In Authentication settings, click **Email Templates**
2. Update each template as follows:

### Confirm Signup Template
Replace the confirmation link with:
\`\`\`html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email&next=/onboarding">Confirm your account</a></p>
\`\`\`

### Magic Link Template
\`\`\`html
<h2>Magic Link</h2>
<p>Follow this link to sign in:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=magiclink&next=/dashboard">Sign in</a></p>
\`\`\`

### Reset Password Template
\`\`\`html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password">Reset Password</a></p>
\`\`\`

### Invite User Template
\`\`\`html
<h2>You have been invited</h2>
<p>You have been invited to create a user on {{ .SiteURL }}. Follow this link to accept the invite:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=invite&next=/onboarding">Accept the invite</a></p>
\`\`\`

## Step 4: Configure OAuth Providers (Optional)

### Google OAuth Setup
1. Go to **Authentication > Providers**
2. Enable **Google**
3. In Google Cloud Console:
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### GitHub OAuth Setup
1. Enable **GitHub** in Supabase
2. In GitHub OAuth App settings:
   - Set Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

## Step 5: Database Configuration

### Enable Row Level Security
Run these SQL commands in the SQL Editor:

\`\`\`sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for pets
CREATE POLICY "Users can view own pets" ON pets
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own pets" ON pets
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own pets" ON pets
  FOR UPDATE USING (auth.uid() = owner_id);
\`\`\`

## Step 6: Environment Variables Setup

### Required Environment Variables
Add these to your `.env.local` file:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# Additional Services
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret
\`\`\`

### For Vercel Deployment
Add these environment variables in your Vercel dashboard:
1. Go to your project settings
2. Navigate to Environment Variables
3. Add each variable for Production, Preview, and Development environments

## Step 7: Testing the Configuration

### Test Email Authentication
1. Try signing up with a new email
2. Check that confirmation email arrives
3. Click the confirmation link
4. Verify you're redirected to `/onboarding`

### Test Password Reset
1. Go to login page
2. Click "Forgot Password"
3. Enter your email
4. Check for reset email
5. Click reset link
6. Verify you're redirected to `/reset-password`

### Test OAuth (if configured)
1. Try signing in with Google/GitHub
2. Verify proper redirect after authentication
3. Check that user profile is created

## Step 8: Production Checklist

- [ ] Site URL is set to production domain
- [ ] All redirect URLs include production domain
- [ ] Email templates use correct redirect URLs
- [ ] OAuth providers configured with correct callback URLs
- [ ] Environment variables set in production
- [ ] RLS policies are enabled and tested
- [ ] Email delivery is working
- [ ] All authentication flows tested

## Troubleshooting

### Common Issues

**"Invalid redirect URL" error:**
- Ensure the exact URL is listed in Supabase redirect URLs
- Check for typos in the URL
- Verify HTTPS is used in production

**Email links not working:**
- Check email template configuration
- Verify NEXT_PUBLIC_SITE_URL is correct
- Test with different email providers

**OAuth redirect errors:**
- Confirm OAuth provider callback URL matches Supabase
- Check OAuth app configuration
- Verify client ID and secret are correct

### Debug Steps
1. Check browser network tab for actual redirect URLs
2. Verify environment variables in production
3. Test authentication in incognito mode
4. Check Supabase logs for detailed error messages
5. Test with different browsers and devices
