import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Performance monitoring for Edge Functions
export class EdgeFunctionMonitor {
  private static instance: EdgeFunctionMonitor
  private metrics: Map<string, any[]> = new Map()

  static getInstance(): EdgeFunctionMonitor {
    if (!EdgeFunctionMonitor.instance) {
      EdgeFunctionMonitor.instance = new EdgeFunctionMonitor()
    }
    return EdgeFunctionMonitor.instance
  }

  // Track Edge Function performance
  async trackFunctionCall(
    functionName: string,
    action: string,
    startTime: number,
    endTime: number,
    success: boolean,
    error?: string,
  ) {
    const duration = endTime - startTime
    const timestamp = new Date().toISOString()

    const metric = {
      function_name: functionName,
      action,
      duration,
      success,
      error,
      timestamp,
      user_agent: typeof window !== "undefined" ? navigator.userAgent : "server",
    }

    // Store locally for batching
    if (!this.metrics.has(functionName)) {
      this.metrics.set(functionName, [])
    }
    this.metrics.get(functionName)!.push(metric)

    // Log to Supabase for analysis
    try {
      await supabase.from("edge_function_metrics").insert(metric)
    } catch (error) {
      console.warn("Failed to log metric:", error)
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[${functionName}] ${action}: ${duration}ms ${success ? "✅" : "❌"}`)
      if (error) console.error(`Error: ${error}`)
    }
  }

  // Get performance metrics
  getMetrics(functionName?: string): any[] {
    if (functionName) {
      return this.metrics.get(functionName) || []
    }
    return Array.from(this.metrics.values()).flat()
  }

  // Calculate average response time
  getAverageResponseTime(functionName: string, timeWindow = 3600000): number {
    const metrics = this.getMetrics(functionName)
    const cutoff = Date.now() - timeWindow

    const recentMetrics = metrics.filter((m) => new Date(m.timestamp).getTime() > cutoff)

    if (recentMetrics.length === 0) return 0

    const totalDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0)
    return totalDuration / recentMetrics.length
  }

  // Calculate success rate
  getSuccessRate(functionName: string, timeWindow = 3600000): number {
    const metrics = this.getMetrics(functionName)
    const cutoff = Date.now() - timeWindow

    const recentMetrics = metrics.filter((m) => new Date(m.timestamp).getTime() > cutoff)

    if (recentMetrics.length === 0) return 100

    const successCount = recentMetrics.filter((m) => m.success).length
    return (successCount / recentMetrics.length) * 100
  }

  // Clear old metrics
  clearOldMetrics(maxAge = 86400000) {
    // 24 hours
    const cutoff = Date.now() - maxAge

    for (const [functionName, metrics] of this.metrics.entries()) {
      const filteredMetrics = metrics.filter((m) => new Date(m.timestamp).getTime() > cutoff)
      this.metrics.set(functionName, filteredMetrics)
    }
  }
}

// Enhanced Edge Functions client with monitoring
export class MonitoredEdgeFunctions {
  private monitor = EdgeFunctionMonitor.getInstance()
  private baseUrl: string

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
  }

  private async callFunction(functionName: string, payload: any, authToken?: string) {
    const startTime = performance.now()
    let success = false
    let error: string | undefined

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`
      }

      const response = await fetch(`${this.baseUrl}/${functionName}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        error = errorData.error || `HTTP ${response.status}`
        throw new Error(error)
      }

      success = true
      return await response.json()
    } catch (err: any) {
      error = err.message
      throw err
    } finally {
      const endTime = performance.now()
      await this.monitor.trackFunctionCall(
        functionName,
        payload.action || "unknown",
        startTime,
        endTime,
        success,
        error,
      )
    }
  }

  // Auth functions with monitoring
  async signUp(email: string, password: string, userData?: any) {
    return this.callFunction("auth", {
      action: "signup",
      email,
      password,
      userData,
    })
  }

  async signIn(email: string, password: string) {
    return this.callFunction("auth", {
      action: "signin",
      email,
      password,
    })
  }

  // Media functions with monitoring
  async generateUploadUrl(fileName: string, fileType: string, folder?: string, authToken?: string) {
    return this.callFunction(
      "media",
      {
        action: "generate-upload-url",
        fileName,
        fileType,
        folder,
      },
      authToken,
    )
  }

  // Chat functions with monitoring
  async sendMessage(conversationId: string, message: string, messageType = "text", authToken?: string) {
    return this.callFunction(
      "chat",
      {
        action: "send-message",
        conversationId,
        message,
        messageType,
      },
      authToken,
    )
  }

  // AI functions with monitoring
  async analyzeHealth(petId: string, symptoms?: string, authToken?: string) {
    return this.callFunction(
      "ai",
      {
        action: "analyze-pet-health",
        petId,
        symptoms,
      },
      authToken,
    )
  }
}

// Export singleton instance
export const monitoredEdgeFunctions = new MonitoredEdgeFunctions()
