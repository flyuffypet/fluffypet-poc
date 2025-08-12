import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options })
          },
        },
      },
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Auth callback error:", error)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
      }

      if (data.session) {
        // Check if user has a profile/role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, platform_role, default_org_id")
          .eq("id", data.user.id)
          .single()

        // If no profile exists, create one
        if (!profile) {
          const { error: profileError } = await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            first_name: data.user.user_metadata?.first_name || "",
            last_name: data.user.user_metadata?.last_name || "",
            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (profileError) {
            console.error("Profile creation error:", profileError)
          }

          // Redirect to onboarding for new users
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // Determine redirect based on role
        if (!profile.role && !profile.platform_role) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        const role = profile.role || profile.platform_role
        let redirectPath = "/dashboard"

        switch (role) {
          case "service_provider":
            redirectPath = "/provider/dashboard"
            break
          case "veterinarian":
            redirectPath = "/vet/dashboard"
            break
          case "admin":
            redirectPath = profile.default_org_id ? "/clinic/dashboard" : "/admin/dashboard"
            break
          case "superadmin":
            redirectPath = "/admin/dashboard"
            break
        }

        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    } catch (error) {
      console.error("Unexpected auth callback error:", error)
      return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=No authorization code provided`)
}
