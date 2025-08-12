import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { action, ...body } = await req.json()

    switch (action) {
      case "signup": {
        const { email, password, userData } = body

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: userData,
        })

        if (authError) throw authError

        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: userData.full_name,
          role: userData.role || "owner",
          created_at: new Date().toISOString(),
        })

        if (profileError) throw profileError

        return new Response(JSON.stringify({ user: authData.user }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "signin": {
        const { email, password } = body

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        return new Response(JSON.stringify({ user: data.user, session: data.session }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "reset-password": {
        const { email } = body

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${Deno.env.get("SITE_URL")}/reset-password`,
        })

        if (error) throw error

        return new Response(JSON.stringify({ message: "Password reset email sent" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "update-password": {
        const { password, accessToken } = body

        const { error } = await supabase.auth.admin.updateUserById(accessToken, { password })

        if (error) throw error

        return new Response(JSON.stringify({ message: "Password updated successfully" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      default:
        throw new Error("Invalid action")
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
