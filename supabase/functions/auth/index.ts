import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { trackFunctionCall } from "../_shared/monitoring.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const startTime = Date.now()
  let functionResult: any = null
  let error: Error | null = null

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const url = new URL(req.url)
    const path = url.pathname.split("/").pop()

    // Health check endpoint
    if (path === "health") {
      try {
        // Test database connectivity
        const { data, error: dbError } = await supabase.from("users").select("count").limit(1).single()

        if (dbError) throw dbError

        functionResult = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: "connected",
          responseTime: Date.now() - startTime,
        }

        return new Response(JSON.stringify(functionResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        })
      } catch (healthError) {
        error = healthError as Error
        functionResult = {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          database: "disconnected",
          error: error.message,
        }

        return new Response(JSON.stringify(functionResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        })
      }
    }

    const { method } = req
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      throw new Error("Authorization header required")
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error("Invalid authentication token")
    }

    switch (method) {
      case "POST": {
        const body = await req.json()
        const { action, ...data } = body

        switch (action) {
          case "signup": {
            const { email, password, userData } = data

            const { data: authData, error: signupError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: userData,
              },
            })

            if (signupError) throw signupError

            // Create user profile
            if (authData.user) {
              const { error: profileError } = await supabase.from("users").insert({
                id: authData.user.id,
                email: authData.user.email,
                full_name: userData.full_name,
                role: userData.role || "owner",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })

              if (profileError) throw profileError
            }

            functionResult = {
              success: true,
              user: authData.user,
              message: "User created successfully",
            }
            break
          }

          case "signin": {
            const { email, password } = data

            const { data: authData, error: signinError } = await supabase.auth.signInWithPassword({
              email,
              password,
            })

            if (signinError) throw signinError

            functionResult = {
              success: true,
              user: authData.user,
              session: authData.session,
              message: "Signed in successfully",
            }
            break
          }

          case "reset-password": {
            const { email } = data

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${Deno.env.get("SITE_URL") || "http://localhost:3000"}/reset-password`,
            })

            if (resetError) throw resetError

            functionResult = {
              success: true,
              message: "Password reset email sent",
            }
            break
          }

          case "update-password": {
            const { password } = data

            const { error: updateError } = await supabase.auth.updateUser({
              password,
            })

            if (updateError) throw updateError

            functionResult = {
              success: true,
              message: "Password updated successfully",
            }
            break
          }

          default:
            throw new Error(`Unknown action: ${action}`)
        }
        break
      }

      default:
        throw new Error(`Method ${method} not allowed`)
    }

    // Track successful function call
    await trackFunctionCall(supabase, {
      function_name: "auth",
      user_id: user.id,
      action: req.method,
      success: true,
      response_time: Date.now() - startTime,
      metadata: { path, action: (await req.clone().json()).action },
    })

    return new Response(JSON.stringify(functionResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    error = err as Error
    console.error("Auth function error:", error)

    // Track failed function call
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await trackFunctionCall(supabase, {
        function_name: "auth",
        user_id: null,
        action: req.method,
        success: false,
        response_time: Date.now() - startTime,
        error_message: error.message,
        metadata: { error: error.stack },
      })
    } catch (trackingError) {
      console.error("Failed to track error:", trackingError)
    }

    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
