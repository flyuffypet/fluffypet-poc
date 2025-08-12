-- Create monitoring tables for Edge Function performance tracking

-- Edge Function metrics table
CREATE TABLE IF NOT EXISTS edge_function_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    function_name TEXT NOT NULL,
    action TEXT NOT NULL,
    duration NUMERIC NOT NULL, -- milliseconds
    success BOOLEAN NOT NULL DEFAULT false,
    error TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_agent TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_function_name ON edge_function_metrics(function_name);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_timestamp ON edge_function_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_edge_function_metrics_success ON edge_function_metrics(success);

-- System health checks table
CREATE TABLE IF NOT EXISTS system_health_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
    response_time NUMERIC, -- milliseconds
    error_message TEXT,
    checked_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for health checks
CREATE INDEX IF NOT EXISTS idx_system_health_checks_service ON system_health_checks(service_name);
CREATE INDEX IF NOT EXISTS idx_system_health_checks_checked_at ON system_health_checks(checked_at);

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service TEXT NOT NULL,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    user_id UUID REFERENCES auth.users(id),
    request_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for error logs
CREATE INDEX IF NOT EXISTS idx_error_logs_service ON error_logs(service);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);

-- Performance analytics view
CREATE OR REPLACE VIEW edge_function_performance AS
SELECT 
    function_name,
    action,
    COUNT(*) as total_calls,
    AVG(duration) as avg_duration,
    MIN(duration) as min_duration,
    MAX(duration) as max_duration,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration) as median_duration,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration) as p95_duration,
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY duration) as p99_duration,
    COUNT(*) FILTER (WHERE success = true) as success_count,
    COUNT(*) FILTER (WHERE success = false) as error_count,
    ROUND(
        (COUNT(*) FILTER (WHERE success = true)::numeric / COUNT(*) * 100), 2
    ) as success_rate,
    DATE_TRUNC('hour', timestamp) as hour
FROM edge_function_metrics 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY function_name, action, DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC, function_name, action;

-- System health summary view
CREATE OR REPLACE VIEW system_health_summary AS
SELECT 
    service_name,
    status,
    AVG(response_time) as avg_response_time,
    COUNT(*) as check_count,
    MAX(checked_at) as last_check,
    COUNT(*) FILTER (WHERE status = 'healthy') as healthy_count,
    COUNT(*) FILTER (WHERE status = 'degraded') as degraded_count,
    COUNT(*) FILTER (WHERE status = 'down') as down_count
FROM system_health_checks 
WHERE checked_at >= NOW() - INTERVAL '1 hour'
GROUP BY service_name, status
ORDER BY service_name, status;

-- Function to clean up old metrics (run daily)
CREATE OR REPLACE FUNCTION cleanup_old_metrics()
RETURNS void AS $$
BEGIN
    -- Keep metrics for 7 days
    DELETE FROM edge_function_metrics 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Keep health checks for 24 hours
    DELETE FROM system_health_checks 
    WHERE checked_at < NOW() - INTERVAL '24 hours';
    
    -- Keep error logs for 30 days
    DELETE FROM error_logs 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on monitoring tables
ALTER TABLE edge_function_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for monitoring (admin access only)
CREATE POLICY "Admin can view all metrics" ON edge_function_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.platform_role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admin can view health checks" ON system_health_checks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.platform_role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admin can view error logs" ON error_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.platform_role IN ('admin', 'superadmin')
        )
    );

-- Grant permissions to service role for Edge Functions
GRANT ALL ON edge_function_metrics TO service_role;
GRANT ALL ON system_health_checks TO service_role;
GRANT ALL ON error_logs TO service_role;

COMMENT ON TABLE edge_function_metrics IS 'Performance metrics for Edge Functions';
COMMENT ON TABLE system_health_checks IS 'System health monitoring data';
COMMENT ON TABLE error_logs IS 'Application error logs';
