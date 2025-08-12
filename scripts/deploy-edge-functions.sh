#!/bin/bash

# Deploy Edge Functions to Supabase
# Make sure you have the Supabase CLI installed and are logged in

set -e

echo "🚀 Deploying FluffyPet Edge Functions to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Please log in to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Check if project ref is set
if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "❌ SUPABASE_PROJECT_REF environment variable is not set"
    echo "Please set it to your Supabase project reference ID"
    exit 1
fi

echo "📋 Project Reference: $SUPABASE_PROJECT_REF"

# Deploy all functions
echo "🔧 Deploying auth function..."
supabase functions deploy auth --project-ref $SUPABASE_PROJECT_REF

echo "🔧 Deploying media function..."
supabase functions deploy media --project-ref $SUPABASE_PROJECT_REF

echo "🔧 Deploying chat function..."
supabase functions deploy chat --project-ref $SUPABASE_PROJECT_REF

echo "🔧 Deploying ai function..."
supabase functions deploy ai --project-ref $SUPABASE_PROJECT_REF

echo "✅ All Edge Functions deployed successfully!"
echo ""
echo "🔗 Function URLs:"
echo "Auth: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/auth"
echo "Media: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/media"
echo "Chat: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/chat"
echo "AI: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/ai"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Supabase dashboard"
echo "2. Test each function with sample requests"
echo "3. Update frontend components to use edge functions"
echo ""
echo "🎉 Deployment complete!"
