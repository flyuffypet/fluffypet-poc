/**
 * Authentication configuration utilities
 * Handles redirect URLs and auth flow configuration
 */

interface AuthConfig {
  siteUrl: string
  redirectUrls: {
    signUp: string
    signIn: string
    signOut: string
    passwordReset: string
    emailChange: string
  }
}

export const getAuthRedirectUrl = (path = "/dashboard") => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/auth/callback?next=${encodeURIComponent(path)}`
}

export const getSignupRedirectUrl = () => {
  return getAuthRedirectUrl("/onboarding")
}

export const getPasswordResetRedirectUrl = () => {
  return getAuthRedirectUrl("/reset-password")
}

export const getMagicLinkRedirectUrl = () => {
  return getAuthRedirectUrl("/dashboard")
}

/**
 * Get the appropriate site URL based on environment
 */
export const getSiteUrl = () => {
  // In production, use the configured site URL
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_SITE_URL || "https://fluffypet.com"
  }

  // In development, use localhost
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}

/**
 * Validate that required auth environment variables are set
 */
export const validateAuthConfig = () => {
  const requiredVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SITE_URL"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

/**
 * Auth configuration for different environments
 */
export const authConfig = {
  siteUrl: getSiteUrl(),
  redirectUrls: {
    signUp: getSignupRedirectUrl(),
    signIn: getAuthRedirectUrl("/dashboard"),
    signOut: getSiteUrl(),
    passwordReset: getPasswordResetRedirectUrl(),
    emailChange: getAuthRedirectUrl("/auth/callback"),
  },
}

export function getAuthConfig(): AuthConfig {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  return {
    siteUrl,
    redirectUrls: {
      signUp: `${siteUrl}/auth/callback`,
      signIn: `${siteUrl}/auth/callback`,
      signOut: `${siteUrl}/`,
      passwordReset: `${siteUrl}/reset-password`,
      emailChange: `${siteUrl}/auth/callback`,
    },
  }
}

export function getRedirectUrl(type: keyof AuthConfig["redirectUrls"], next?: string): string {
  const config = getAuthConfig()
  const baseUrl = config.redirectUrls[type]

  if (next && type !== "signOut") {
    const url = new URL(baseUrl)
    url.searchParams.set("next", next)
    return url.toString()
  }

  return baseUrl
}

export function getEmailRedirectUrl(type: "signup" | "recovery" | "email_change"): string {
  const config = getAuthConfig()

  switch (type) {
    case "signup":
      return `${config.siteUrl}/auth/callback`
    case "recovery":
      return `${config.siteUrl}/reset-password`
    case "email_change":
      return `${config.siteUrl}/auth/callback`
    default:
      return `${config.siteUrl}/auth/callback`
  }
}

// Validate that the current URL is an allowed redirect URL
export function isValidRedirectUrl(url: string): boolean {
  const config = getAuthConfig()
  const allowedDomains = [new URL(config.siteUrl).origin, "http://localhost:3000", "http://127.0.0.1:3000"]

  // Add Vercel preview domains if in Vercel environment
  if (process.env.VERCEL_URL) {
    allowedDomains.push(`https://${process.env.VERCEL_URL}`)
  }

  try {
    const urlObj = new URL(url)
    return allowedDomains.some((domain) => urlObj.origin === domain)
  } catch {
    return false
  }
}
