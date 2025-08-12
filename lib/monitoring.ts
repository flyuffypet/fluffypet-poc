import { createClient } from "@supabase/supabase-js"

// Types for monitoring data
export interface EdgeFunctionMetric {
  id?: string
  function_name: string
  action?: string
  response_time_ms: number
  success: boolean
  user_id?: string
  metadata?: Record<string, any>
  created_at?: string
}

export interface SystemHealthCheck {
  id?: string
  service_name: string
  status: "healthy" | "degraded" | "down"
  response_time_ms?: number
  metadata?: Record<string, any>
  created_at?: string
}

export interface ErrorLog {
  id?: string
  function_name: string
  error_message: string
  stack_trace?: string
  user_id?: string
  metadata?: Record<string, any>
  created_at?: string
}

export interface MonitoringSummary {
  function_name: string
  total_calls: number
  successful_calls: number
  failed_calls: number
  avg_response_time: number
  p95_response_time: number
  p99_response_time: number
  success_rate_percent: number
  hour_bucket: string
}

// Monitoring service class
export class MonitoringService {
  private supabase: ReturnType<typeof createClient>

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  // Track Edge Function performance
  async trackFunctionCall(
    functionName: string,
    action: string | undefined,
    responseTimeMs: number,
    success: boolean,
    userId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from("edge_function_metrics").insert({
        function_name: functionName,
        action,
        response_time_ms: responseTimeMs,
        success,
        user_id: userId,
        metadata: metadata || {},
      })

      if (error) {
        console.error("Failed to track function call:", error)
      }
    } catch (err) {
      console.error("Error tracking function call:", err)
    }
  }

  // Record system health check
  async recordHealthCheck(
    serviceName: string,
    status: "healthy" | "degraded" | "down",
    responseTimeMs?: number,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from("system_health_checks").insert({
        service_name: serviceName,
        status,
        response_time_ms: responseTimeMs,
        metadata: metadata || {},
      })

      if (error) {
        console.error("Failed to record health check:", error)
      }
    } catch (err) {
      console.error("Error recording health check:", err)
    }
  }

  // Log error with details
  async logError(
    functionName: string,
    errorMessage: string,
    stackTrace?: string,
    userId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const { error } = await this.supabase.from("error_logs").insert({
        function_name: functionName,
        error_message: errorMessage,
        stack_trace: stackTrace,
        user_id: userId,
        metadata: metadata || {},
      })

      if (error) {
        console.error("Failed to log error:", error)
      }
    } catch (err) {
      console.error("Error logging error:", err)
    }
  }

  // Get monitoring summary
  async getMonitoringSummary(): Promise<MonitoringSummary[]> {
    try {
      const { data, error } = await this.supabase
        .from("monitoring_summary")
        .select("*")
        .order("hour_bucket", { ascending: false })
        .limit(100)

      if (error) {
        console.error("Failed to get monitoring summary:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error getting monitoring summary:", err)
      return []
    }
  }

  // Get recent errors
  async getRecentErrors(limit = 50): Promise<ErrorLog[]> {
    try {
      const { data, error } = await this.supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Failed to get recent errors:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error getting recent errors:", err)
      return []
    }
  }

  // Get system health status
  async getSystemHealth(): Promise<SystemHealthCheck[]> {
    try {
      const { data, error } = await this.supabase
        .from("system_health_checks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) {
        console.error("Failed to get system health:", error)
        return []
      }

      return data || []
    } catch (err) {
      console.error("Error getting system health:", err)
      return []
    }
  }

  // Cleanup old data
  async cleanupOldData(): Promise<void> {
    try {
      const { error } = await this.supabase.rpc("cleanup_old_metrics")

      if (error) {
        console.error("Failed to cleanup old data:", error)
      }
    } catch (err) {
      console.error("Error cleaning up old data:", err)
    }
  }
}

// Wrapper function for easy Edge Function monitoring
export async function withMonitoring<T>(
  functionName: string,
  action: string,
  fn: () => Promise<T>,
  userId?: string,
): Promise<T> {
  const startTime = Date.now()
  let success = false
  let error: Error | null = null

  try {
    const result = await fn()
    success = true
    return result
  } catch (err) {
    error = err as Error
    throw err
  } finally {
    const responseTime = Date.now() - startTime

    // Initialize monitoring service
    const monitoring = new MonitoringService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Track the function call
    await monitoring.trackFunctionCall(functionName, action, responseTime, success, userId)

    // Log error if one occurred
    if (error) {
      await monitoring.logError(functionName, error.message, error.stack, userId, { action })
    }
  }
}

// Health check wrapper
export async function healthCheck(serviceName: string, checkFn: () => Promise<boolean>): Promise<void> {
  const startTime = Date.now()
  let status: "healthy" | "degraded" | "down" = "down"

  try {
    const isHealthy = await checkFn()
    const responseTime = Date.now() - startTime

    if (isHealthy) {
      status = responseTime > 1000 ? "degraded" : "healthy"
    }

    const monitoring = new MonitoringService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    await monitoring.recordHealthCheck(serviceName, status, responseTime)
  } catch (err) {
    const responseTime = Date.now() - startTime

    const monitoring = new MonitoringService(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    await monitoring.recordHealthCheck(serviceName, "down", responseTime, {
      error: (err as Error).message,
    })
  }
}

// Export default monitoring instance
export const monitoring = new MonitoringService(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)
