import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    })

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=Authentication failed: ${error.message}`)
      }

      // Check if user needs onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        if (!profile || !profile.onboarding_completed) {
          return NextResponse.redirect(`${requestUrl.origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
      console.error("Unexpected error during auth callback:", error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Unexpected authentication error`)
    }
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login?error=No authentication code provided`)
}
