-- FluffyPet Monitoring Infrastructure
-- Creates comprehensive monitoring tables for Edge Functions and system health

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create monitoring tables
CREATE TABLE IF NOT EXISTS public.edge_function_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_name TEXT NOT NULL,
    action TEXT,
    response_time_ms INTEGER NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_health_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
    response_time_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    function_name TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_function_name ON public.edge_function_metrics(function_name);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_created_at ON public.edge_function_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_user_id ON public.edge_function_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_success ON public.edge_function_metrics(success);

CREATE INDEX IF NOT EXISTS idx_system_health_checks_service_name ON public.system_health_checks(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_created_at ON public.system_health_checks(created_at);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_status ON public.system_health_checks(status);

CREATE INDEX IF NOT EXISTS idx_error_logs_function_name ON public.error_logs(function_name);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON public.error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);

-- Create monitoring summary view (regular view, not SECURITY DEFINER)
CREATE OR REPLACE VIEW public.monitoring_summary AS
SELECT 
    function_name,
    COUNT(*) as total_calls,
    COUNT(*) FILTER (WHERE success = true) as successful_calls,
    COUNT(*) FILTER (WHERE success = false) as failed_calls,
    ROUND(AVG(response_time_ms)) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) as p99_response_time,
    ROUND(COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*), 2) as success_rate_percent,
    DATE_TRUNC('hour', created_at) as hour_bucket
FROM public.edge_function_metrics
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY function_name, DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket DESC, total_calls DESC;

-- Enable Row Level Security
ALTER TABLE public.edge_function_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can read all metrics" ON public.edge_function_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND platform_role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Service role can insert metrics" ON public.edge_function_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read all health checks" ON public.system_health_checks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND platform_role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Service role can insert health checks" ON public.system_health_checks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can read all error logs" ON public.error_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND platform_role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Service role can insert error logs" ON public.error_logs
    FOR INSERT WITH CHECK (true);

-- Create cleanup function with secure search path
CREATE OR REPLACE FUNCTION public.cleanup_old_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Grant necessary permissions
GRANT SELECT ON public.monitoring_summary TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Add comments for documentation
COMMENT ON TABLE public.edge_function_metrics IS 'Performance metrics for Edge Functions';
COMMENT ON TABLE public.system_health_checks IS 'System health monitoring data';
COMMENT ON TABLE public.error_logs IS 'Error tracking and debugging information';
COMMENT ON VIEW public.monitoring_summary IS 'Aggregated monitoring metrics for dashboards';
