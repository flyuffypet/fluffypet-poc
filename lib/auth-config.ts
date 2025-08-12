/**
 * Authentication configuration utilities
 * Handles redirect URLs and auth flow configuration
 */

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
  redirectUrls: {
    signUp: getSignupRedirectUrl(),
    signIn: getAuthRedirectUrl("/dashboard"),
    passwordReset: getPasswordResetRedirectUrl(),
    magicLink: getMagicLinkRedirectUrl(),
  },
  siteUrl: getSiteUrl(),
}
