-- Create monitoring tables for Edge Functions performance tracking
-- This script sets up comprehensive monitoring infrastructure

-- Edge Function Metrics Table
CREATE TABLE IF NOT EXISTS public.edge_function_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    function_name TEXT NOT NULL,
    action TEXT NOT NULL,
    response_time_ms INTEGER NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    error_message TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Health Checks Table
CREATE TABLE IF NOT EXISTS public.system_health_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
    response_time_ms INTEGER NOT NULL,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error Logs Table
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    function_name TEXT NOT NULL,
    action TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_function_name ON public.edge_function_metrics(function_name);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_created_at ON public.edge_function_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_success ON public.edge_function_metrics(success);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_user_id ON public.edge_function_metrics(user_id);

CREATE INDEX IF NOT EXISTS idx_system_health_checks_service_name ON public.system_health_checks(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_created_at ON public.system_health_checks(created_at);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_status ON public.system_health_checks(status);

CREATE INDEX IF NOT EXISTS idx_error_logs_function_name ON public.error_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE public.edge_function_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read monitoring data
CREATE POLICY "Admins can read edge function metrics" ON public.edge_function_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND platform_role = 'admin'
        )
    );

CREATE POLICY "Admins can read system health checks" ON public.system_health_checks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND platform_role = 'admin'
        )
    );

CREATE POLICY "Admins can read error logs" ON public.error_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND platform_role = 'admin'
        )
    );

-- Service role can insert monitoring data
CREATE POLICY "Service role can insert metrics" ON public.edge_function_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert health checks" ON public.system_health_checks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert error logs" ON public.error_logs
    FOR INSERT WITH CHECK (true);

-- Create a function to clean up old monitoring data
CREATE OR REPLACE FUNCTION public.cleanup_monitoring_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete metrics older than 30 days
    DELETE FROM public.edge_function_metrics 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Delete health checks older than 7 days
    DELETE FROM public.system_health_checks 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Delete error logs older than 90 days
    DELETE FROM public.error_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Create a scheduled job to run cleanup daily (requires pg_cron extension)
-- This will be enabled if pg_cron is available
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        PERFORM cron.schedule('cleanup-monitoring-data', '0 2 * * *', 'SELECT public.cleanup_monitoring_data();');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- pg_cron not available, skip scheduling
        NULL;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.edge_function_metrics TO service_role;
GRANT ALL ON public.system_health_checks TO service_role;
GRANT ALL ON public.error_logs TO service_role;

-- Create a view for aggregated metrics (admin only)
CREATE OR REPLACE VIEW public.monitoring_summary AS
SELECT 
    function_name,
    action,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE success = true) as successful_requests,
    ROUND(AVG(response_time_ms)) as avg_response_time_ms,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time_ms,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time_ms,
    COUNT(*) FILTER (WHERE success = false) as error_count,
    DATE_TRUNC('hour', created_at) as hour_bucket
FROM public.edge_function_metrics
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY function_name, action, DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC, function_name, action;

-- Grant access to the view
GRANT SELECT ON public.monitoring_summary TO authenticated;

COMMENT ON TABLE public.edge_function_metrics IS 'Performance metrics for Edge Functions';
COMMENT ON TABLE public.system_health_checks IS 'System health monitoring data';
COMMENT ON TABLE public.error_logs IS 'Detailed error logging for debugging';
COMMENT ON VIEW public.monitoring_summary IS 'Aggregated monitoring metrics for dashboard display';
