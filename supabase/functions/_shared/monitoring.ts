import { monitoring } from "../../../lib/monitoring.ts"

export async function withMonitoring<T>(
  functionName: string,
  action: string,
  handler: () => Promise<T>,
  userId?: string,
): Promise<T> {
  const startTime = Date.now()
  let success = false
  let error: Error | undefined

  try {
    const result = await handler()
    success = true
    return result
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err))
    throw error
  } finally {
    const endTime = Date.now()

    // Track the function call asynchronously to avoid blocking the response
    monitoring.trackFunctionCall(functionName, action, startTime, endTime, success, error, userId).catch(console.error)
  }
}

export function createMonitoredHandler(functionName: string) {
  return async (req: Request): Promise<Response> => {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
    }

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders })
    }

    try {
      const { action, ...data } = await req.json()

      if (!action) {
        return new Response(JSON.stringify({ error: "Action is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // Health check endpoint
      if (action === "health-check") {
        return new Response(
          JSON.stringify({
            status: "healthy",
            function: functionName,
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }

      // Extract user ID from authorization header if present
      const authHeader = req.headers.get("authorization")
      let userId: string | undefined

      if (authHeader?.startsWith("Bearer ")) {
        try {
          const token = authHeader.substring(7)
          // In a real implementation, you would decode the JWT to get the user ID
          // For now, we'll leave it undefined unless explicitly provided
        } catch (err) {
          console.warn("Failed to decode JWT token:", err)
        }
      }

      // This will be overridden by specific function implementations
      throw new Error(`Handler not implemented for function: ${functionName}`)
    } catch (error) {
      console.error(`Error in ${functionName}:`, error)

      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Internal server error",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }
  }
}

// Health check utility for system monitoring
export async function performHealthCheck(serviceName: string, checkFunction: () => Promise<void>): Promise<void> {
  const startTime = Date.now()
  let status: "healthy" | "degraded" | "down" = "healthy"
  let error: string | undefined

  try {
    await checkFunction()
  } catch (err) {
    status = "down"
    error = err instanceof Error ? err.message : String(err)
  }

  const endTime = Date.now()
  const responseTime = endTime - startTime

  // Determine if service is degraded based on response time
  if (status === "healthy" && responseTime > 5000) {
    status = "degraded"
  }

  await monitoring.recordHealthCheck(serviceName, status, responseTime, error)
}
