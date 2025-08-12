-- Fix security definer view errors by removing SECURITY DEFINER from views
-- This addresses the security warnings about views with SECURITY DEFINER

-- Drop existing views if they exist with SECURITY DEFINER
DROP VIEW IF EXISTS public.system_health_summary;
DROP VIEW IF EXISTS public.edge_function_performance;

-- Recreate views without SECURITY DEFINER (regular views)
CREATE OR REPLACE VIEW public.system_health_summary AS
SELECT 
    service_name,
    status,
    COUNT(*) as check_count,
    AVG(response_time_ms) as avg_response_time,
    MAX(response_time_ms) as max_response_time,
    MIN(response_time_ms) as min_response_time,
    COUNT(*) FILTER (WHERE status = 'healthy') as healthy_count,
    COUNT(*) FILTER (WHERE status = 'degraded') as degraded_count,
    COUNT(*) FILTER (WHERE status = 'down') as down_count,
    DATE_TRUNC('hour', created_at) as hour_bucket
FROM public.system_health_checks
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY service_name, status, DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC, service_name;

CREATE OR REPLACE VIEW public.edge_function_performance AS
SELECT 
    function_name,
    COUNT(*) as total_calls,
    COUNT(*) FILTER (WHERE success = true) as successful_calls,
    ROUND(AVG(response_time_ms)) as avg_response_time,
    PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY response_time_ms) as median_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time,
    COUNT(*) FILTER (WHERE success = false) as error_count,
    ROUND(COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*), 2) as success_rate_percent
FROM public.edge_function_metrics
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY function_name
ORDER BY total_calls DESC;

-- Grant access to the views
GRANT SELECT ON public.system_health_summary TO authenticated;
GRANT SELECT ON public.edge_function_performance TO authenticated;

-- Add RLS policies for the views (they inherit from underlying tables)
-- No additional policies needed as views will use the underlying table policies

COMMENT ON VIEW public.system_health_summary IS 'System health summary without SECURITY DEFINER';
COMMENT ON VIEW public.edge_function_performance IS 'Edge Function performance metrics without SECURITY DEFINER';
