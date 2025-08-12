#!/bin/bash

# Health check script for FluffyPet Edge Functions
# This script tests all Edge Functions and reports their status

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SUPABASE_PROJECT_REF="${SUPABASE_PROJECT_REF}"
BASE_URL="https://${SUPABASE_PROJECT_REF}.supabase.co/functions/v1"
TIMEOUT=10

if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo -e "${RED}❌ SUPABASE_PROJECT_REF environment variable is not set${NC}"
    exit 1
fi

echo -e "${BLUE}🏥 FluffyPet Health Check${NC}"
echo "=========================="
echo "Base URL: $BASE_URL"
echo "Timeout: ${TIMEOUT}s"
echo ""

# Function to test an Edge Function
test_function() {
    local func_name=$1
    local test_payload=$2
    local expected_status=${3:-200}
    
    echo -n "Testing $func_name... "
    
    local start_time=$(date +%s%3N)
    local response=$(curl -s -w "%{http_code}" -m $TIMEOUT \
        -X POST "$BASE_URL/$func_name" \
        -H "Content-Type: application/json" \
        -d "$test_payload" 2>/dev/null || echo "000")
    
    local end_time=$(date +%s%3N)
    local duration=$((end_time - start_time))
    
    local http_code="${response: -3}"
    local body="${response%???}"
    
    if [ "$http_code" = "000" ]; then
        echo -e "${RED}❌ TIMEOUT${NC}"
        return 1
    elif [ "$http_code" = "$expected_status" ] || [ "$http_code" = "400" ]; then
        echo -e "${GREEN}✅ OK${NC} (${duration}ms, HTTP $http_code)"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (${duration}ms, HTTP $http_code)"
        if [ -n "$body" ]; then
            echo "   Response: $body"
        fi
        return 1
    fi
}

# Test all Edge Functions
echo -e "${YELLOW}Testing Edge Functions:${NC}"

# Auth Function
test_function "auth" '{"action":"health-check"}' 200
auth_status=$?

# Media Function  
test_function "media" '{"action":"health-check"}' 200
media_status=$?

# Chat Function
test_function "chat" '{"action":"health-check"}' 200
chat_status=$?

# AI Function
test_function "ai" '{"action":"health-check"}' 200
ai_status=$?

echo ""

# Summary
total_tests=4
passed_tests=$((4 - auth_status - media_status - chat_status - ai_status))

echo -e "${BLUE}📊 Summary:${NC}"
echo "Passed: $passed_tests/$total_tests"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 All health checks passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some health checks failed${NC}"
    exit 1
fi
