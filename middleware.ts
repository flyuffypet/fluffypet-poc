import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getRateLimitIdentifier, apiRateLimiter } from "./lib/rate-limiter"

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const identifier = getRateLimitIdentifier(request)
    const { allowed, resetTime } = apiRateLimiter.isAllowed(identifier)

    if (!allowed) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Reset": resetTime?.toString() || "",
        },
      })
    }
  }

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
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/auth/callback",
    "/api",
    "/_next",
    "/favicon.ico",
    // Marketing & Company pages
    "/how-it-works",
    "/features",
    "/about",
    "/contact",
    "/careers",
    "/pricing",
    "/partners",
    "/press",
    "/blog",
    "/our-story",
    // Discovery & Directory pages
    "/discover",
    "/vets",
    "/providers",
    "/ngos",
    "/events",
    // Community pages (read-only public access)
    "/community",
    // Lost & Found pages
    "/lost-found",
    // Adoption & Rescue pages
    "/adopt",
    "/rescues",
    // E-commerce pages
    "/shop",
    // Help & Legal pages
    "/help",
    "/status",
    "/privacy",
    "/terms",
    "/cookies",
    "/gdpr",
    "/security",
    "/aup",
    // SEO & Utility pages
    "/in",
    "/breeds",
    "/download",
    "/p",
    // Organization profiles
    "/org",
    "/seller",
    // SOS emergency page
    "/sos",
  ]

  const isPublicRoute = publicRoutes.some((route) => {
    if (route === pathname) return true
    if (pathname.startsWith(route + "/")) return true
    // Handle dynamic routes
    if (route === "/vets" && pathname.match(/^\/vets\/[^/]+$/)) return true
    if (route === "/providers" && pathname.match(/^\/providers\/[^/]+$/)) return true
    if (route === "/ngos" && pathname.match(/^\/ngos\/[^/]+$/)) return true
    if (route === "/events" && pathname.match(/^\/events\/[^/]+$/)) return true
    if (route === "/community" && pathname.match(/^\/community\/(tags|post)\/[^/]+$/)) return true
    if (route === "/lost-found" && pathname.match(/^\/lost-found\/[^/]+$/)) return true
    if (route === "/adopt" && pathname.match(/^\/adopt\/[^/]+$/)) return true
    if (route === "/shop" && pathname.match(/^\/shop\/(c|p|s)\/[^/]+$/)) return true
    if (route === "/help" && pathname.match(/^\/help\/[^/]+$/)) return true
    if (route === "/blog" && pathname.match(/^\/blog\/[^/]+$/)) return true
    if (route === "/in" && pathname.match(/^\/in\/[^/]+\/(vets|groomers)$/)) return true
    if (route === "/breeds" && pathname.match(/^\/breeds\/[^/]+$/)) return true
    if (route === "/p" && pathname.match(/^\/p\/[^/]+$/)) return true
    if (route === "/org" && pathname.match(/^\/org\/[^/]+$/)) return true
    if (route === "/seller" && pathname.match(/^\/seller\/[^/]+$/)) return true
    return false
  })

  const redirectCount = Number.parseInt(request.headers.get("x-redirect-count") || "0")
  const lastRedirectPath = request.headers.get("x-last-redirect-path")

  // Detect redirect loops
  if (redirectCount > 3 || (redirectCount > 1 && lastRedirectPath === pathname)) {
    console.warn(`Redirect loop detected for ${pathname}, redirecting to fallback`)
    const fallbackResponse = NextResponse.redirect(new URL("/", request.url))
    fallbackResponse.headers.set("x-redirect-count", "0")
    fallbackResponse.headers.delete("x-last-redirect-path")
    return fallbackResponse
  }

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("next", pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
    redirectResponse.headers.set("x-last-redirect-path", pathname)
    return redirectResponse
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
        // Redirect non-admin users to appropriate dashboard
        const fallbackUrl = profile?.role ? "/dashboard" : "/onboarding"
        const redirectResponse = NextResponse.redirect(new URL(fallbackUrl, request.url))
        redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
        redirectResponse.headers.set("x-last-redirect-path", pathname)
        return redirectResponse
      }
    }

    if (pathname === "/dashboard" && profile) {
      const role = profile.role || profile.platform_role

      // Redirect to appropriate dashboard based on user role
      let targetPath = "/dashboard" // Default fallback

      switch (role) {
        case "service_provider":
          targetPath = "/provider/dashboard"
          break
        case "veterinarian":
          targetPath = "/vet/dashboard"
          break
        case "admin":
          targetPath = profile.default_org_id ? "/clinic/dashboard" : "/admin/dashboard"
          break
        case "volunteer":
          targetPath = "/volunteer/dashboard"
          break
        case "superadmin":
          targetPath = "/admin/dashboard"
          break
        default:
          // Pet owners and others stay on /dashboard
          return response
      }

      if (targetPath !== "/dashboard") {
        const redirectResponse = NextResponse.redirect(new URL(targetPath, request.url))
        redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
        redirectResponse.headers.set("x-last-redirect-path", pathname)
        return redirectResponse
      }
    }

    if (!profile?.role && !profile?.platform_role && pathname !== "/onboarding") {
      const userCreatedAt = new Date(user.created_at).getTime()
      const profileCreatedAt = profile?.created_at ? new Date(profile.created_at).getTime() : userCreatedAt
      const now = Date.now()
      const tenMinutesAgo = now - 10 * 60 * 1000

      // Only redirect to onboarding if user/profile was created recently
      if (userCreatedAt > tenMinutesAgo || profileCreatedAt > tenMinutesAgo) {
        const redirectResponse = NextResponse.redirect(new URL("/onboarding", request.url))
        redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
        redirectResponse.headers.set("x-last-redirect-path", pathname)
        return redirectResponse
      } else {
        // Existing user without role - redirect to dashboard instead of onboarding
        const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url))
        redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
        redirectResponse.headers.set("x-last-redirect-path", pathname)
        return redirectResponse
      }
    }
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const next = url.searchParams.get("next")
    if (next && !next.startsWith("/login") && !next.startsWith("/signup")) {
      const redirectResponse = NextResponse.redirect(new URL(next, request.url))
      redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
      redirectResponse.headers.set("x-last-redirect-path", pathname)
      return redirectResponse
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
        const redirectResponse = NextResponse.redirect(new URL("/onboarding", request.url))
        redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
        redirectResponse.headers.set("x-last-redirect-path", pathname)
        return redirectResponse
      }

      let targetPath = "/dashboard" // Default fallback

      switch (role) {
        case "service_provider":
          targetPath = "/provider/dashboard"
          break
        case "veterinarian":
          targetPath = "/vet/dashboard"
          break
        case "admin":
          targetPath = profile.default_org_id ? "/clinic/dashboard" : "/admin/dashboard"
          break
        case "volunteer":
          targetPath = "/volunteer/dashboard"
          break
        case "superadmin":
          targetPath = "/admin/dashboard"
          break
      }

      const redirectResponse = NextResponse.redirect(new URL(targetPath, request.url))
      redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
      redirectResponse.headers.set("x-last-redirect-path", pathname)
      return redirectResponse
    }

    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url))
    redirectResponse.headers.set("x-redirect-count", (redirectCount + 1).toString())
    redirectResponse.headers.set("x-last-redirect-path", pathname)
    return redirectResponse
  }

  response.headers.delete("x-redirect-count")
  response.headers.delete("x-last-redirect-path")

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
