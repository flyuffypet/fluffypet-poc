#!/bin/bash

# Deploy Edge Functions to Supabase with monitoring integration
# This script deploys all Edge Functions for the FluffyPet platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying FluffyPet Edge Functions with Monitoring${NC}"
echo "================================================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed. Please install it first:${NC}"
    echo "npm install -g supabase"
    exit 1
fi

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}⚠️  Supabase project not linked. Attempting to link...${NC}"
    
    if [ -z "$SUPABASE_PROJECT_REF" ]; then
        echo -e "${RED}❌ SUPABASE_PROJECT_REF environment variable is not set.${NC}"
        echo "Please set it to your Supabase project reference ID."
        exit 1
    fi
    
    supabase link --project-ref "$SUPABASE_PROJECT_REF"
fi

echo -e "${GREEN}✅ Supabase project linked${NC}"

# Check environment variables
required_vars=("SUPABASE_PROJECT_REF" "SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo -e "${BLUE}📦 Project Reference: $SUPABASE_PROJECT_REF${NC}"
echo ""

# Function to deploy a single Edge Function
deploy_function() {
    local function_name=$1
    echo -e "${YELLOW}🔧 Deploying $function_name function...${NC}"
    
    if supabase functions deploy "$function_name" --project-ref "$SUPABASE_PROJECT_REF"; then
        echo -e "${GREEN}✅ $function_name function deployed successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to deploy $function_name function${NC}"
        return 1
    fi
}

# Function to test deployed function
test_function() {
    local function_name=$1
    local endpoint="https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/$function_name/health"
    
    echo -e "${YELLOW}🧪 Testing $function_name function...${NC}"
    
    response=$(curl -s -w "%{http_code}" -m 10 "$endpoint" 2>/dev/null)
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ $function_name is responding correctly${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $function_name returned HTTP $http_code (may need environment variables)${NC}"
        return 1
    fi
}

# Deploy all Edge Functions
functions=("auth" "media" "chat" "ai")
deployed_functions=0
tested_functions=0

echo -e "${BLUE}🚀 Starting deployment...${NC}"
echo ""

for func in "${functions[@]}"; do
    if deploy_function "$func"; then
        ((deployed_functions++))
        
        # Wait a moment for deployment to propagate
        sleep 2
        
        if test_function "$func"; then
            ((tested_functions++))
        fi
    fi
    echo ""
done

echo -e "${BLUE}📊 Deployment Summary${NC}"
echo "======================"
echo -e "${BLUE}Functions deployed: $deployed_functions/${#functions[@]}${NC}"
echo -e "${BLUE}Functions tested: $tested_functions/${#functions[@]}${NC}"

if [ $deployed_functions -eq ${#functions[@]} ]; then
    echo ""
    echo -e "${GREEN}🎉 All Edge Functions deployed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🔗 Function URLs:${NC}"
    for func in "${functions[@]}"; do
        echo -e "${GREEN}$func: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/$func${NC}"
    done
    echo ""
    echo -e "${BLUE}🏥 Health Check URLs:${NC}"
    for func in "${functions[@]}"; do
        echo -e "${GREEN}$func: https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/$func/health${NC}"
    done
    echo ""
    echo -e "${BLUE}📝 Next steps:${NC}"
    echo "1. Set environment variables in Supabase Dashboard:"
    echo "   - OPENAI_API_KEY (for AI functionality)"
    echo "   - SITE_URL (your production URL)"
    echo ""
    echo "2. Run health checks:"
    echo "   npm run health-check"
    echo ""
    echo "3. Monitor function performance:"
    echo "   Check the admin monitoring dashboard"
    echo ""
    echo -e "${GREEN}✨ FluffyPet Edge Functions are ready for production!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some functions failed to deploy${NC}"
    echo "Please check the errors above and try again."
    exit 1
fi
