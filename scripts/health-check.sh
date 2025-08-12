#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🏥 FluffyPet Health Check${NC}"
echo "=========================="

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}❌ Error: NEXT_PUBLIC_SUPABASE_URL environment variable is not set${NC}"
    exit 1
fi

if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Error: SUPABASE_ANON_KEY environment variable is not set${NC}"
    exit 1
fi

SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL"
SUPABASE_KEY="$SUPABASE_ANON_KEY"

echo -e "${GREEN}✅ Environment variables configured${NC}"
echo ""

# Function to check Edge Function health
check_edge_function() {
    local function_name=$1
    local endpoint="$SUPABASE_URL/functions/v1/$function_name/health"
    
    echo -e "${YELLOW}🔍 Checking $function_name...${NC}"
    
    # Make request with timeout
    response=$(curl -s -w "%{http_code}" -m 10 \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -H "Content-Type: application/json" \
        "$endpoint" 2>/dev/null)
    
    # Extract HTTP status code (last 3 characters)
    http_code="${response: -3}"
    response_body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}  ✅ $function_name is healthy${NC}"
        return 0
    elif [ "$http_code" = "000" ]; then
        echo -e "${RED}  ❌ $function_name is unreachable (timeout)${NC}"
        return 1
    else
        echo -e "${RED}  ❌ $function_name returned HTTP $http_code${NC}"
        return 1
    fi
}

# Function to check database connection
check_database() {
    echo -e "${YELLOW}🔍 Checking database connection...${NC}"
    
    response=$(curl -s -w "%{http_code}" -m 10 \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        "$SUPABASE_URL/rest/v1/profiles?select=count&limit=1" 2>/dev/null)
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}  ✅ Database is accessible${NC}"
        return 0
    else
        echo -e "${RED}  ❌ Database connection failed (HTTP $http_code)${NC}"
        return 1
    fi
}

# Function to check monitoring tables
check_monitoring_tables() {
    echo -e "${YELLOW}🔍 Checking monitoring tables...${NC}"
    
    tables=("edge_function_metrics" "system_health_checks" "error_logs")
    
    for table in "${tables[@]}"; do
        response=$(curl -s -w "%{http_code}" -m 10 \
            -H "apikey: $SUPABASE_KEY" \
            -H "Authorization: Bearer $SUPABASE_KEY" \
            "$SUPABASE_URL/rest/v1/$table?select=count&limit=1" 2>/dev/null)
        
        http_code="${response: -3}"
        
        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}  ✅ Table $table is accessible${NC}"
        else
            echo -e "${RED}  ❌ Table $table is not accessible (HTTP $http_code)${NC}"
        fi
    done
}

# Start health checks
echo -e "${BLUE}🚀 Starting health checks...${NC}"
echo ""

# Check database first
check_database
db_status=$?

echo ""

# Check monitoring infrastructure
check_monitoring_tables

echo ""

# Check Edge Functions
edge_functions=("auth" "media" "chat" "ai")
healthy_functions=0
total_functions=${#edge_functions[@]}

for func in "${edge_functions[@]}"; do
    if check_edge_function "$func"; then
        ((healthy_functions++))
    fi
done

echo ""
echo -e "${BLUE}📊 Health Check Summary${NC}"
echo "========================"

if [ $db_status -eq 0 ]; then
    echo -e "${GREEN}✅ Database: Healthy${NC}"
else
    echo -e "${RED}❌ Database: Unhealthy${NC}"
fi

echo -e "${BLUE}📈 Edge Functions: $healthy_functions/$total_functions healthy${NC}"

if [ $healthy_functions -eq $total_functions ] && [ $db_status -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All systems are healthy!${NC}"
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some systems need attention${NC}"
    exit 1
fi
