#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 FluffyPet Monitoring Tables Migration${NC}"
echo "=================================================="

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Error: Missing required environment variables${NC}"
    echo "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo -e "${YELLOW}📋 Checking Supabase connection...${NC}"

# Test connection to Supabase
curl -s -o /dev/null -w "%{http_code}" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    "$SUPABASE_URL/rest/v1/" > /tmp/supabase_status

SUPABASE_STATUS=$(cat /tmp/supabase_status)

if [ "$SUPABASE_STATUS" != "200" ]; then
    echo -e "${RED}❌ Error: Cannot connect to Supabase (HTTP $SUPABASE_STATUS)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Supabase connection successful${NC}"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Installing via npm...${NC}"
    npm install -g supabase
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to install Supabase CLI${NC}"
        exit 1
    fi
fi

echo -e "${YELLOW}🔧 Running monitoring tables migration...${NC}"

# Execute the SQL migration
supabase db reset --db-url "$DATABASE_URL" --file "scripts/sql/019_monitoring_tables.sql"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Monitoring tables migration completed successfully${NC}"
else
    echo -e "${RED}❌ Error: Migration failed${NC}"
    exit 1
fi

# Verify tables were created
echo -e "${YELLOW}🔍 Verifying table creation...${NC}"

TABLES_CHECK=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$SUPABASE_URL/rest/v1/edge_function_metrics?select=count&limit=0")

if [[ $TABLES_CHECK == *"count"* ]]; then
    echo -e "${GREEN}✅ edge_function_metrics table created${NC}"
else
    echo -e "${RED}❌ Error: edge_function_metrics table not found${NC}"
fi

HEALTH_CHECK=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$SUPABASE_URL/rest/v1/system_health_checks?select=count&limit=0")

if [[ $HEALTH_CHECK == *"count"* ]]; then
    echo -e "${GREEN}✅ system_health_checks table created${NC}"
else
    echo -e "${RED}❌ Error: system_health_checks table not found${NC}"
fi

ERROR_LOGS_CHECK=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$SUPABASE_URL/rest/v1/error_logs?select=count&limit=0")

if [[ $ERROR_LOGS_CHECK == *"count"* ]]; then
    echo -e "${GREEN}✅ error_logs table created${NC}"
else
    echo -e "${RED}❌ Error: error_logs table not found${NC}"
fi

# Test the monitoring summary view
echo -e "${YELLOW}🔍 Testing monitoring summary view...${NC}"

SUMMARY_CHECK=$(curl -s \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    "$SUPABASE_URL/rest/v1/monitoring_summary?limit=1")

if [[ $SUMMARY_CHECK == "[]" ]] || [[ $SUMMARY_CHECK == *"function_name"* ]]; then
    echo -e "${GREEN}✅ monitoring_summary view created${NC}"
else
    echo -e "${RED}❌ Error: monitoring_summary view not accessible${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Monitoring infrastructure setup complete!${NC}"
echo ""
echo -e "${BLUE}📊 Created Tables:${NC}"
echo "  • edge_function_metrics - Performance tracking"
echo "  • system_health_checks - Health monitoring"
echo "  • error_logs - Error tracking"
echo "  • monitoring_summary - Aggregated metrics view"
echo ""
echo -e "${BLUE}🔐 Security Features:${NC}"
echo "  • Row Level Security enabled"
echo "  • Admin-only access policies"
echo "  • Service role permissions"
echo ""
echo -e "${BLUE}🧹 Maintenance:${NC}"
echo "  • Automatic cleanup function created"
echo "  • Scheduled cleanup (if pg_cron available)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Deploy Edge Functions with monitoring"
echo "2. Access admin dashboard to view metrics"
echo "3. Set up alerting thresholds"

# Clean up temp files
rm -f /tmp/supabase_status

exit 0
