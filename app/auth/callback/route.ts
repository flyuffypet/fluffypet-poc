import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_error`)
      }

      if (data.user) {
        // Check if user profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError && profileError.code === "PGRST116") {
          // Profile doesn't exist, create one
          const { error: insertError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
            avatar_url: data.user.user_metadata?.avatar_url || "",
            role: "owner",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (insertError) {
            console.error("Profile creation error:", insertError)
          }
        }

        // Redirect to onboarding for new users or dashboard for existing users
        const redirectTo = profile ? "/dashboard" : "/onboarding"
        return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`)
      }
    } catch (error) {
      console.error("Unexpected auth callback error:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`)
    }
  }

  // Return the user to the login page if no code is present
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
