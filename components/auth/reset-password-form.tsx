"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase-client"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [step, setStep] = useState<"request" | "reset">("request")
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check if we have access token (from email link)
  const accessToken = searchParams.get("access_token")
  const refreshToken = searchParams.get("refresh_token")

  useState(() => {
    if (accessToken && refreshToken) {
      setStep("reset")
    }
  }, [accessToken, refreshToken])

  const handleRequestReset = async (formData: FormData) => {
    setIsLoading(true)
    setError("")
    setMessage("")

    const email = formData.get("email") as string

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email for the password reset link!")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (formData: FormData) => {
    setIsLoading(true)
    setError("")
    setMessage("")

    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      // Set the session from URL params
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (sessionError) {
          setError("Invalid reset link. Please request a new one.")
          setIsLoading(false)
          return
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage("Password updated successfully! Redirecting...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{step === "request" ? "Reset Password" : "Set New Password"}</CardTitle>
        <CardDescription>
          {step === "request" ? "Enter your email to receive a password reset link" : "Enter your new password below"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "request" ? (
          <form action={handleRequestReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        ) : (
          <form action={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        )}

        {error && (
          <Alert className="mt-4" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="mt-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => router.push("/login")} disabled={isLoading}>
            Back to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ResetPasswordForm
