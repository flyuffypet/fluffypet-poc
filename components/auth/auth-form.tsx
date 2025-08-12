"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SocialAuthButtons from "./social-auth-buttons"
import { track } from "@vercel/analytics"
import { signIn, signUp } from "@/lib/actions/auth-actions"

type Mode = "signin" | "signup"

export default function AuthForm({ mode = "signin" as Mode }: { mode?: Mode }) {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get("next") || (mode === "signup" ? "/onboarding" : "/dashboard")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === "signup") {
        track("sign_up_attempt", { method: "email_password" })
      } else {
        track("sign_in_attempt", { method: "email_password" })
      }
    } catch (analyticsError) {
      console.warn("Analytics tracking failed:", analyticsError)
    }

    try {
      const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password)

      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        if (typeof result.success === "string") {
          setSuccess(result.success)
        }

        if (result.redirectTo) {
          router.push(result.redirectTo)
        }
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-2">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            name="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder={mode === "signup" ? "Create a password" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">Or continue with</div>
      <SocialAuthButtons />

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-muted-foreground">{success}</p>}
    </div>
  )
}
