# Edge Functions Deployment Guide

## Prerequisites

1. **Install Supabase CLI**:
   \`\`\`bash
   npm install -g supabase
   \`\`\`

2. **Login to Supabase**:
   \`\`\`bash
   supabase login
   \`\`\`

3. **Set Environment Variables**:
   \`\`\`bash
   export SUPABASE_PROJECT_REF=your-project-ref-id
   \`\`\`

## Deployment Steps

### 1. Deploy All Functions
\`\`\`bash
npm run deploy-functions
\`\`\`

### 2. Deploy Individual Functions
\`\`\`bash
# Deploy auth function
npm run deploy-auth

# Deploy media function
npm run deploy-media

# Deploy chat function
npm run deploy-chat

# Deploy AI function
npm run deploy-ai
\`\`\`

### 3. Set Environment Variables in Supabase Dashboard

Go to your Supabase project dashboard → Settings → Edge Functions → Environment Variables

Add these variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `SITE_URL`: Your production site URL (e.g., https://fluffypet.com)
- `OPENAI_API_KEY`: Your OpenAI API key

### 4. Test Functions

After deployment, test each function:

\`\`\`bash
# Test auth function
curl -X POST https://your-project-ref.supabase.co/functions/v1/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "signin", "email": "test@example.com", "password": "password"}'

# Test media function
curl -X POST https://your-project-ref.supabase.co/functions/v1/media \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"action": "generate-upload-url", "fileName": "test.jpg", "fileType": "image/jpeg"}'
\`\`\`

## Function URLs

After deployment, your functions will be available at:
- Auth: `https://your-project-ref.supabase.co/functions/v1/auth`
- Media: `https://your-project-ref.supabase.co/functions/v1/media`
- Chat: `https://your-project-ref.supabase.co/functions/v1/chat`
- AI: `https://your-project-ref.supabase.co/functions/v1/ai`

## Monitoring

Monitor your functions in the Supabase dashboard:
1. Go to Edge Functions section
2. View logs and metrics
3. Monitor performance and errors

## Troubleshooting

### Common Issues:

1. **Authentication Error**: Make sure JWT tokens are properly passed
2. **CORS Issues**: Check that CORS headers are properly set
3. **Environment Variables**: Verify all required env vars are set
4. **Database Access**: Ensure service role key has proper permissions

### Debugging:

1. Check function logs in Supabase dashboard
2. Test functions individually
3. Verify environment variables
4. Check database permissions
