#!/bin/bash

# Health check script for FluffyPet Edge Functions
# This script tests all Edge Functions and reports their status

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_PROJECT_REF=${SUPABASE_PROJECT_REF:-""}
BASE_URL="https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1"
TIMEOUT=30
FUNCTIONS=("auth" "media" "chat" "ai")

# Check if required environment variables are set
if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo -e "${RED}❌ SUPABASE_PROJECT_REF environment variable is not set${NC}"
    exit 1
fi

echo -e "${BLUE}🏥 FluffyPet Health Check${NC}"
echo "=================================="
echo "Base URL: $BASE_URL"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Function to test a single Edge Function
test_function() {
    local func_name=$1
    local url="${BASE_URL}/${func_name}"
    
    echo -e "${YELLOW}🔍 Testing ${func_name} function...${NC}"
    
    # Test health check endpoint
    local start_time=$(date +%s%3N)
    local response=$(curl -s -w "%{http_code}|%{time_total}" \
        --max-time $TIMEOUT \
        -X POST "$url" \
        -H "Content-Type: application/json" \
        -d '{"action":"health-check"}' 2>/dev/null || echo "000|0")
    
    local end_time=$(date +%s%3N)
    local http_code=$(echo "$response" | cut -d'|' -f1)
    local response_time=$(echo "$response" | cut -d'|' -f2)
    local duration=$((end_time - start_time))
    
    # Determine status based on HTTP code
    case $http_code in
        200)
            echo -e "${GREEN}✅ ${func_name}: Healthy (${duration}ms)${NC}"
            return 0
            ;;
        400|404|405)
            echo -e "${YELLOW}⚠️  ${func_name}: Responding but may have issues (HTTP ${http_code}, ${duration}ms)${NC}"
            return 1
            ;;
        500|502|503|504)
            echo -e "${RED}❌ ${func_name}: Server error (HTTP ${http_code}, ${duration}ms)${NC}"
            return 2
            ;;
        000)
            echo -e "${RED}❌ ${func_name}: Connection failed or timeout${NC}"
            return 2
            ;;
        *)
            echo -e "${RED}❌ ${func_name}: Unexpected response (HTTP ${http_code}, ${duration}ms)${NC}"
            return 2
            ;;
    esac
}

# Test all functions
healthy_count=0
warning_count=0
error_count=0

for func in "${FUNCTIONS[@]}"; do
    test_function "$func"
    case $? in
        0) ((healthy_count++)) ;;
        1) ((warning_count++)) ;;
        2) ((error_count++)) ;;
    esac
    echo ""
done

# Summary
echo "=================================="
echo -e "${BLUE}📊 Health Check Summary${NC}"
echo ""
echo -e "${GREEN}✅ Healthy: ${healthy_count}${NC}"
echo -e "${YELLOW}⚠️  Warnings: ${warning_count}${NC}"
echo -e "${RED}❌ Errors: ${error_count}${NC}"
echo ""

# Overall status
total_functions=${#FUNCTIONS[@]}
if [ $error_count -eq 0 ] && [ $warning_count -eq 0 ]; then
    echo -e "${GREEN}🎉 All systems operational!${NC}"
    exit 0
elif [ $error_count -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Some functions have warnings but are operational${NC}"
    exit 1
elif [ $error_count -lt $total_functions ]; then
    echo -e "${RED}🚨 Some functions are down - partial outage${NC}"
    exit 2
else
    echo -e "${RED}🚨 All functions are down - complete outage${NC}"
    exit 3
fi
