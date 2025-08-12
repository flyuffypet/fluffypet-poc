import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declare Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const { action, email, password, userData, newPassword } = await req.json()

    switch (action) {
      case "signup": {
        const { data, error } = await supabaseClient.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: userData || {},
        })

        if (error) throw error

        // Create user profile
        const { error: profileError } = await supabaseClient.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData?.full_name || "",
          role: userData?.role || "owner",
          created_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
        }

        return new Response(JSON.stringify({ user: data.user }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "signin": {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        return new Response(JSON.stringify({ user: data.user, session: data.session }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "reset-password": {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${Deno.env.get("SITE_URL")}/reset-password`,
        })

        if (error) throw error

        return new Response(JSON.stringify({ message: "Password reset email sent" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "update-password": {
        const authHeader = req.headers.get("Authorization")
        if (!authHeader) throw new Error("No authorization header")

        const {
          data: { user },
          error: authError,
        } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""))

        if (authError || !user) throw new Error("Unauthorized")

        const { error } = await supabaseClient.auth.admin.updateUserById(user.id, {
          password: newPassword,
        })

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
