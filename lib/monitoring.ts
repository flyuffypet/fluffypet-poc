import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface EdgeFunctionMetric {
  id?: string
  function_name: string
  action: string
  response_time_ms: number
  success: boolean
  error_message?: string
  user_id?: string
  created_at?: string
}

export interface SystemHealthCheck {
  id?: string
  service_name: string
  status: "healthy" | "degraded" | "down"
  response_time_ms: number
  error_message?: string
  metadata?: Record<string, any>
  created_at?: string
}

export interface ErrorLog {
  id?: string
  function_name: string
  action: string
  error_message: string
  stack_trace?: string
  user_id?: string
  metadata?: Record<string, any>
  created_at?: string
}

export class MonitoringService {
  async trackFunctionCall(
    functionName: string,
    action: string,
    startTime: number,
    endTime: number,
    success: boolean,
    error?: Error,
    userId?: string,
  ): Promise<void> {
    try {
      const metric: EdgeFunctionMetric = {
        function_name: functionName,
        action,
        response_time_ms: endTime - startTime,
        success,
        error_message: error?.message,
        user_id: userId,
      }

      await supabase.from("edge_function_metrics").insert(metric)

      // Also log errors separately for detailed tracking
      if (error) {
        await this.logError(functionName, action, error, userId)
      }
    } catch (err) {
      console.error("Failed to track function call:", err)
    }
  }

  async logError(
    functionName: string,
    action: string,
    error: Error,
    userId?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const errorLog: ErrorLog = {
        function_name: functionName,
        action,
        error_message: error.message,
        stack_trace: error.stack,
        user_id: userId,
        metadata,
      }

      await supabase.from("error_logs").insert(errorLog)
    } catch (err) {
      console.error("Failed to log error:", err)
    }
  }

  async recordHealthCheck(
    serviceName: string,
    status: "healthy" | "degraded" | "down",
    responseTime: number,
    error?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      const healthCheck: SystemHealthCheck = {
        service_name: serviceName,
        status,
        response_time_ms: responseTime,
        error_message: error,
        metadata,
      }

      await supabase.from("system_health_checks").insert(healthCheck)
    } catch (err) {
      console.error("Failed to record health check:", err)
    }
  }

  async getMetrics(
    functionName?: string,
    timeRange: "hour" | "day" | "week" = "hour",
  ): Promise<{
    totalRequests: number
    successRate: number
    avgResponseTime: number
    p95ResponseTime: number
    p99ResponseTime: number
    errorCount: number
  }> {
    try {
      const timeFilter = this.getTimeFilter(timeRange)

      let query = supabase.from("edge_function_metrics").select("*").gte("created_at", timeFilter)

      if (functionName) {
        query = query.eq("function_name", functionName)
      }

      const { data: metrics, error } = await query

      if (error) throw error

      if (!metrics || metrics.length === 0) {
        return {
          totalRequests: 0,
          successRate: 0,
          avgResponseTime: 0,
          p95ResponseTime: 0,
          p99ResponseTime: 0,
          errorCount: 0,
        }
      }

      const totalRequests = metrics.length
      const successfulRequests = metrics.filter((m) => m.success).length
      const successRate = (successfulRequests / totalRequests) * 100
      const errorCount = totalRequests - successfulRequests

      const responseTimes = metrics.map((m) => m.response_time_ms).sort((a, b) => a - b)
      const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      const p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)]
      const p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)]

      return {
        totalRequests,
        successRate,
        avgResponseTime: Math.round(avgResponseTime),
        p95ResponseTime: p95ResponseTime || 0,
        p99ResponseTime: p99ResponseTime || 0,
        errorCount,
      }
    } catch (error) {
      console.error("Failed to get metrics:", error)
      throw error
    }
  }

  async getSystemHealth(): Promise<{
    services: Array<{
      name: string
      status: "healthy" | "degraded" | "down"
      lastCheck: string
      responseTime: number
    }>
    overallStatus: "healthy" | "degraded" | "down"
  }> {
    try {
      const { data: healthChecks, error } = await supabase
        .from("system_health_checks")
        .select("*")
        .gte("created_at", new Date(Date.now() - 5 * 60 * 1000).toISOString()) // Last 5 minutes
        .order("created_at", { ascending: false })

      if (error) throw error

      const serviceMap = new Map()

      healthChecks?.forEach((check) => {
        if (!serviceMap.has(check.service_name)) {
          serviceMap.set(check.service_name, check)
        }
      })

      const services = Array.from(serviceMap.values()).map((check) => ({
        name: check.service_name,
        status: check.status,
        lastCheck: check.created_at,
        responseTime: check.response_time_ms,
      }))

      // Determine overall status
      let overallStatus: "healthy" | "degraded" | "down" = "healthy"
      const downServices = services.filter((s) => s.status === "down")
      const degradedServices = services.filter((s) => s.status === "degraded")

      if (downServices.length > 0) {
        overallStatus = "down"
      } else if (degradedServices.length > 0) {
        overallStatus = "degraded"
      }

      return { services, overallStatus }
    } catch (error) {
      console.error("Failed to get system health:", error)
      throw error
    }
  }

  async getRecentErrors(limit = 50): Promise<ErrorLog[]> {
    try {
      const { data: errors, error } = await supabase
        .from("error_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return errors || []
    } catch (error) {
      console.error("Failed to get recent errors:", error)
      throw error
    }
  }

  private getTimeFilter(timeRange: "hour" | "day" | "week"): string {
    const now = new Date()
    let timeAgo: Date

    switch (timeRange) {
      case "hour":
        timeAgo = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case "day":
        timeAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "week":
        timeAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
    }

    return timeAgo.toISOString()
  }
}

export const monitoring = new MonitoringService()
