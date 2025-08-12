import { MonitoringService, withMonitoring, healthCheck } from "../../../lib/monitoring.ts"
import { Deno } from "https://deno.land/std@0.166.0/node/global.ts"

// Initialize monitoring service for Edge Functions
const monitoring = new MonitoringService(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!)

// CORS headers for Edge Functions
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
}

// Wrapper for Edge Functions with monitoring
export async function withEdgeFunctionMonitoring<T>(
  functionName: string,
  action: string,
  handler: () => Promise<T>,
  userId?: string,
): Promise<Response> {
  try {
    const result = await withMonitoring(functionName, action, handler, userId)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error(`Error in ${functionName}:`, error)

    return new Response(
      JSON.stringify({
        error: error.message,
        function: functionName,
        action,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    )
  }
}

// Health check endpoint for Edge Functions
export async function createHealthCheckEndpoint(serviceName: string) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders })
    }

    try {
      await healthCheck(serviceName, async () => {
        // Simple health check - verify database connection
        const { data, error } = await monitoring.supabase.from("profiles").select("count").limit(1)

        return !error
      })

      return new Response(
        JSON.stringify({
          status: "healthy",
          service: serviceName,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      )
    } catch (error) {
      return new Response(
        JSON.stringify({
          status: "unhealthy",
          service: serviceName,
          error: error.message,
          timestamp: new Date().toISOString(),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        },
      )
    }
  }
}

// Utility to extract user ID from JWT token
export function extractUserIdFromRequest(req: Request): string | undefined {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) return undefined

    const token = authHeader.replace("Bearer ", "")
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub
  } catch {
    return undefined
  }
}

// Export monitoring instance for direct use
export { monitoring }
