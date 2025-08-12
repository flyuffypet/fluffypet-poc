import type { NextRequest } from "next/server"

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>()

  constructor(private config: RateLimitConfig) {}

  isAllowed(identifier: string): { allowed: boolean; resetTime?: number } {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // Clean up old entries
    this.cleanup(windowStart)

    const userRequests = this.requests.get(identifier)

    if (!userRequests) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.config.windowMs })
      return { allowed: true }
    }

    if (userRequests.resetTime <= now) {
      // Reset window
      this.requests.set(identifier, { count: 1, resetTime: now + this.config.windowMs })
      return { allowed: true }
    }

    if (userRequests.count >= this.config.maxRequests) {
      return { allowed: false, resetTime: userRequests.resetTime }
    }

    userRequests.count++
    return { allowed: true }
  }

  private cleanup(windowStart: number) {
    for (const [key, value] of this.requests.entries()) {
      if (value.resetTime <= windowStart) {
        this.requests.delete(key)
      }
    }
  }
}

// Rate limiter instances for different endpoints
export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
})

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
})

export function getRateLimitIdentifier(request: NextRequest): string {
  // Use IP address as identifier, fallback to user agent
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip")
  return ip || request.headers.get("user-agent") || "anonymous"
}
