// Shared monitoring utilities for Edge Functions

export interface PerformanceMetric {
  functionName: string
  action: string
  duration: number
  success: boolean
  error?: string
  timestamp: string
  userId?: string
}

export class EdgeFunctionLogger {
  private supabaseUrl: string
  private serviceRoleKey: string

  constructor(supabaseUrl: string, serviceRoleKey: string) {
    this.supabaseUrl = supabaseUrl
    this.serviceRoleKey = serviceRoleKey
  }

  async logMetric(metric: PerformanceMetric) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/edge_function_metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
        },
        body: JSON.stringify({
          function_name: metric.functionName,
          action: metric.action,
          duration: metric.duration,
          success: metric.success,
          error: metric.error,
          timestamp: metric.timestamp,
          user_id: metric.userId,
        }),
      })

      if (!response.ok) {
        console.warn("Failed to log metric:", await response.text())
      }
    } catch (error) {
      console.warn("Error logging metric:", error)
    }
  }

  async logError(
    service: string,
    errorType: string,
    errorMessage: string,
    stackTrace?: string,
    userId?: string,
    metadata?: any,
  ) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/error_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
        },
        body: JSON.stringify({
          service,
          error_type: errorType,
          error_message: errorMessage,
          stack_trace: stackTrace,
          user_id: userId,
          metadata: metadata || {},
        }),
      })

      if (!response.ok) {
        console.warn("Failed to log error:", await response.text())
      }
    } catch (error) {
      console.warn("Error logging error:", error)
    }
  }

  async logHealthCheck(
    serviceName: string,
    status: "healthy" | "degraded" | "down",
    responseTime?: number,
    errorMessage?: string,
    metadata?: any,
  ) {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/system_health_checks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.serviceRoleKey}`,
          apikey: this.serviceRoleKey,
        },
        body: JSON.stringify({
          service_name: serviceName,
          status,
          response_time: responseTime,
          error_message: errorMessage,
          metadata: metadata || {},
        }),
      })

      if (!response.ok) {
        console.warn("Failed to log health check:", await response.text())
      }
    } catch (error) {
      console.warn("Error logging health check:", error)
    }
  }
}

// Performance monitoring wrapper
export function withMonitoring<T extends any[], R>(
  functionName: string,
  action: string,
  fn: (...args: T) => Promise<R>,
  logger: EdgeFunctionLogger,
) {
  return async (...args: T): Promise<R> => {
    const startTime = performance.now()
    const timestamp = new Date().toISOString()
    let success = false
    let error: string | undefined

    try {
      const result = await fn(...args)
      success = true
      return result
    } catch (err: any) {
      error = err.message
      throw err
    } finally {
      const endTime = performance.now()
      const duration = endTime - startTime

      await logger.logMetric({
        functionName,
        action,
        duration,
        success,
        error,
        timestamp,
      })
    }
  }
}

// CORS headers for Edge Functions
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
}

// Standard error response
export function createErrorResponse(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

// Standard success response
export function createSuccessResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}
