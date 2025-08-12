import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/auth/callback", "/api", "/_next", "/favicon.ico"]

  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated, get their profile for role-based routing
  if (user && !isPublicRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, platform_role, default_org_id, created_at")
      .eq("id", user.id)
      .single()

    if (pathname.startsWith("/admin")) {
      const hasAdminAccess =
        profile?.role === "admin" ||
        profile?.role === "superadmin" ||
        profile?.platform_role === "admin" ||
        profile?.platform_role === "superadmin"

      if (!hasAdminAccess) {
        // Redirect non-admin users away from admin routes
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    if (pathname === "/dashboard" && profile) {
      const role = profile.role || profile.platform_role

      // Redirect to appropriate dashboard based on user role
      switch (role) {
        case "service_provider":
          return NextResponse.redirect(new URL("/provider/dashboard", request.url))
        case "veterinarian":
          return NextResponse.redirect(new URL("/vet/dashboard", request.url))
        case "admin":
          if (profile.default_org_id) {
            return NextResponse.redirect(new URL("/clinic/dashboard", request.url))
          } else {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url))
          }
        case "volunteer":
          return NextResponse.redirect(new URL("/volunteer/dashboard", request.url))
        case "superadmin":
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        default:
          // Pet owners stay on /dashboard
          break
      }
    }

    if (!profile?.role && !profile?.platform_role && pathname !== "/onboarding") {
      const userCreatedAt = new Date(user.created_at).getTime()
      const profileCreatedAt = profile?.created_at ? new Date(profile.created_at).getTime() : userCreatedAt
      const now = Date.now()
      const tenMinutesAgo = now - 10 * 60 * 1000 // Extended to 10 minutes

      // Only redirect to onboarding if user/profile was created recently
      if (userCreatedAt > tenMinutesAgo || profileCreatedAt > tenMinutesAgo) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      } else {
        // Existing user without role - redirect to dashboard instead of onboarding
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const next = url.searchParams.get("next")
    if (next) {
      return NextResponse.redirect(new URL(next, request.url))
    }

    // Get user profile to determine appropriate redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, platform_role, default_org_id")
      .eq("id", user.id)
      .single()

    if (profile) {
      const role = profile.role || profile.platform_role

      // If no role is set, redirect to onboarding
      if (!role) {
        return NextResponse.redirect(new URL("/onboarding", request.url))
      }

      switch (role) {
        case "service_provider":
          return NextResponse.redirect(new URL("/provider/dashboard", request.url))
        case "veterinarian":
          return NextResponse.redirect(new URL("/vet/dashboard", request.url))
        case "admin":
          if (profile.default_org_id) {
            return NextResponse.redirect(new URL("/clinic/dashboard", request.url))
          } else {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url))
          }
        case "volunteer":
          return NextResponse.redirect(new URL("/volunteer/dashboard", request.url))
        case "superadmin":
          return NextResponse.redirect(new URL("/admin/dashboard", request.url))
        default:
          break
      }
    }

    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
