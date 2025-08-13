import { createServerClient } from "@/lib/supabase-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = createServerClient()

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_error`)
      }

      if (data.user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from("users")
          .select("role, onboarding_completed")
          .eq("id", data.user.id)
          .single()

        if (profile?.onboarding_completed) {
          return NextResponse.redirect(`${requestUrl.origin}${next}`)
        } else {
          return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
        }
      }
    } catch (error) {
      console.error("Auth callback error:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_callback_error`)
    }
  }

  // If no code or error, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
