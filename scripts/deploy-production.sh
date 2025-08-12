#!/bin/bash

# Production deployment script for FluffyPet platform
# This script handles both Vercel deployment and Supabase Edge Functions

set -e

echo "🚀 Starting FluffyPet Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check required environment variables
check_env_vars() {
    echo -e "${BLUE}📋 Checking environment variables...${NC}"
    
    required_vars=(
        "SUPABASE_PROJECT_REF"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "OPENAI_API_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}❌ Missing required environment variable: $var${NC}"
            exit 1
        fi
    done
    
    echo -e "${GREEN}✅ All required environment variables are set${NC}"
}

# Deploy Edge Functions
deploy_edge_functions() {
    echo -e "${BLUE}🔧 Deploying Supabase Edge Functions...${NC}"
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo -e "${RED}❌ Supabase CLI is not installed${NC}"
        echo "Install with: npm install -g supabase"
        exit 1
    fi
    
    # Deploy each function
    functions=("auth" "media" "chat" "ai")
    
    for func in "${functions[@]}"; do
        echo -e "${YELLOW}📦 Deploying $func function...${NC}"
        if supabase functions deploy "$func" --project-ref "$SUPABASE_PROJECT_REF"; then
            echo -e "${GREEN}✅ $func function deployed successfully${NC}"
        else
            echo -e "${RED}❌ Failed to deploy $func function${NC}"
            exit 1
        fi
    done
}

# Set Edge Function environment variables
set_edge_function_env() {
    echo -e "${BLUE}🔐 Setting Edge Function environment variables...${NC}"
    
    # Set secrets for Edge Functions
    echo "$OPENAI_API_KEY" | supabase secrets set OPENAI_API_KEY --project-ref "$SUPABASE_PROJECT_REF"
    echo "$SUPABASE_SERVICE_ROLE_KEY" | supabase secrets set SUPABASE_SERVICE_ROLE_KEY --project-ref "$SUPABASE_PROJECT_REF"
    echo "$NEXT_PUBLIC_SUPABASE_URL" | supabase secrets set SUPABASE_URL --project-ref "$SUPABASE_PROJECT_REF"
    
    echo -e "${GREEN}✅ Edge Function environment variables set${NC}"
}

# Deploy to Vercel
deploy_vercel() {
    echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI is not installed${NC}"
        echo "Install with: npm install -g vercel"
        exit 1
    fi
    
    # Deploy to production
    if vercel --prod --yes; then
        echo -e "${GREEN}✅ Vercel deployment successful${NC}"
    else
        echo -e "${RED}❌ Vercel deployment failed${NC}"
        exit 1
    fi
}

# Run health checks
run_health_checks() {
    echo -e "${BLUE}🏥 Running health checks...${NC}"
    
    # Wait for deployment to be ready
    sleep 30
    
    # Test Edge Functions
    functions=("auth" "media" "chat" "ai")
    base_url="https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1"
    
    for func in "${functions[@]}"; do
        echo -e "${YELLOW}🔍 Testing $func function...${NC}"
        
        response=$(curl -s -o /dev/null -w "%{http_code}" \
            -X POST "$base_url/$func" \
            -H "Content-Type: application/json" \
            -d '{"action":"health-check"}' || echo "000")
        
        if [ "$response" = "200" ] || [ "$response" = "400" ]; then
            echo -e "${GREEN}✅ $func function is responding${NC}"
        else
            echo -e "${RED}❌ $func function health check failed (HTTP $response)${NC}"
        fi
    done
}

# Main deployment flow
main() {
    echo -e "${GREEN}🎯 FluffyPet Production Deployment${NC}"
    echo "=================================="
    
    check_env_vars
    deploy_edge_functions
    set_edge_function_env
    deploy_vercel
    run_health_checks
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📊 Monitoring URLs:${NC}"
    echo "• Supabase Dashboard: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF"
    echo "• Vercel Dashboard: https://vercel.com/dashboard"
    echo "• Edge Functions: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Monitor Edge Function performance in Supabase Dashboard"
    echo "2. Check application logs in Vercel Dashboard"
    echo "3. Run end-to-end tests"
    echo "4. Monitor error rates and response times"
}

# Run main function
main "$@"
