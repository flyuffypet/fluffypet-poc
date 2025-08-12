import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/dashboard"
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  if (error) {
    console.error("OAuth error:", error, errorDescription)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const supabase = createSupabaseServerClient()

  // Exchange the auth code for a session (sets cookies)
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
  if (exchangeError) {
    console.error("Auth callback error:", exchangeError)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", "Authentication failed. Please try again.")
    return NextResponse.redirect(loginUrl)
  }

  // Fetch the signed-in user
  const { data: userRes } = await supabase.auth.getUser()
  const user = userRes?.user

  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, platform_role, default_org_id, created_at")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code === "PGRST116") {
      // Profile doesn't exist, create it
      const { error: createError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || "User",
        last_name: user.user_metadata?.last_name || "Name",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (createError) {
        console.error("Profile creation error:", createError)
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("error", "Failed to create user profile. Please contact support.")
        return NextResponse.redirect(loginUrl)
      }

      // New user without role - redirect to onboarding
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    if (profile) {
      const role = profile.role || profile.platform_role

      if (!role) {
        // User exists but no role set - redirect to onboarding
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }

      // Role-based dashboard redirection
      let dashboardUrl = "/dashboard"
      switch (role) {
        case "service_provider":
          dashboardUrl = "/provider/dashboard"
          break
        case "veterinarian":
          dashboardUrl = "/vet/dashboard"
          break
        case "admin":
          dashboardUrl = profile.default_org_id ? "/clinic/dashboard" : "/admin/dashboard"
          break
        case "volunteer":
          dashboardUrl = "/volunteer/dashboard"
          break
        case "superadmin":
          dashboardUrl = "/admin/dashboard"
          break
        default:
          dashboardUrl = "/dashboard" // pet_owner
          break
      }

      // If next parameter specifies a different dashboard, use role-based one instead
      if (next === "/dashboard" || next.includes("/dashboard")) {
        return NextResponse.redirect(new URL(dashboardUrl, request.url))
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
