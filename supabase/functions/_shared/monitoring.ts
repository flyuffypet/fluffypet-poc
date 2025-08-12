import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2"

export interface FunctionCallData {
  function_name: string
  user_id: string | null
  action: string
  success: boolean
  response_time: number
  error_message?: string
  metadata?: Record<string, any>
}

export async function trackFunctionCall(supabase: SupabaseClient, data: FunctionCallData): Promise<void> {
  try {
    await supabase.from("function_calls").insert({
      id: crypto.randomUUID(),
      function_name: data.function_name,
      user_id: data.user_id,
      action: data.action,
      success: data.success,
      response_time: data.response_time,
      error_message: data.error_message,
      metadata: data.metadata || {},
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Failed to track function call:", error)
    // Don't throw - monitoring failures shouldn't break the main function
  }
}

export async function updateSystemHealth(
  supabase: SupabaseClient,
  component: string,
  status: "healthy" | "degraded" | "down",
  responseTime?: number,
  errorMessage?: string,
): Promise<void> {
  try {
    await supabase.from("system_health").upsert(
      {
        component,
        status,
        last_check: new Date().toISOString(),
        response_time: responseTime,
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "component",
      },
    )
  } catch (error) {
    console.error("Failed to update system health:", error)
  }
}
