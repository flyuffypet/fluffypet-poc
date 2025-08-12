#!/bin/bash

# Deploy Edge Functions to Supabase
# This script deploys all Edge Functions for the FluffyPet platform

set -e

echo "🚀 Deploying FluffyPet Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ Supabase project not linked. Please run 'supabase link' first."
    exit 1
fi

# Check environment variables
if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "❌ SUPABASE_PROJECT_REF environment variable is not set."
    echo "Please set it to your Supabase project reference ID."
    exit 1
fi

echo "📦 Project Reference: $SUPABASE_PROJECT_REF"

# Deploy Auth Function
echo "🔐 Deploying Auth Function..."
if supabase functions deploy auth --project-ref "$SUPABASE_PROJECT_REF"; then
    echo "✅ Auth function deployed successfully"
else
    echo "❌ Failed to deploy Auth function"
    exit 1
fi

# Deploy Media Function
echo "📸 Deploying Media Function..."
if supabase functions deploy media --project-ref "$SUPABASE_PROJECT_REF"; then
    echo "✅ Media function deployed successfully"
else
    echo "❌ Failed to deploy Media function"
    exit 1
fi

# Deploy Chat Function
echo "💬 Deploying Chat Function..."
if supabase functions deploy chat --project-ref "$SUPABASE_PROJECT_REF"; then
    echo "✅ Chat function deployed successfully"
else
    echo "❌ Failed to deploy Chat function"
    exit 1
fi

# Deploy AI Function
echo "🤖 Deploying AI Function..."
if supabase functions deploy ai --project-ref "$SUPABASE_PROJECT_REF"; then
    echo "✅ AI function deployed successfully"
else
    echo "❌ Failed to deploy AI function"
    exit 1
fi

echo ""
echo "🎉 All Edge Functions deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Supabase Dashboard:"
echo "   - OPENAI_API_KEY (for AI functionality)"
echo "   - SITE_URL (your production URL)"
echo ""
echo "2. Test the functions:"
echo "   - Auth: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/auth"
echo "   - Media: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/media"
echo "   - Chat: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/chat"
echo "   - AI: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/ai"
echo ""
echo "3. Update your frontend to use the Edge Functions client library"
echo ""
echo "✨ FluffyPet Edge Functions are ready for production!"
