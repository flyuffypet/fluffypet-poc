"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase-client"
import { SocialAuthButtons } from "./social-auth-buttons"

interface AuthFormProps {
  mode?: "signin" | "signup"
  redirectTo?: string
}

export function AuthForm({ mode = "signin", redirectTo = "/dashboard" }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match")
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          },
        })

        if (error) throw error

        // Show success message for signup
        setError("Check your email for the confirmation link!")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push(redirectTo)
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "signin"
            ? "Enter your email and password to sign in"
            : "Enter your details to create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialAuthButtons onAuth={handleSocialAuth} isLoading={isLoading} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>
          )}

          {error && (
            <Alert variant={error.includes("Check your email") ? "default" : "destructive"}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="text-center text-sm">
          {mode === "signin" ? (
            <>
              Don't have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => router.push("/signup")}>
                Sign up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button variant="link" className="p-0" onClick={() => router.push("/login")}>
                Sign in
              </Button>
            </>
          )}
        </div>

        {mode === "signin" && (
          <div className="text-center">
            <Button variant="link" className="p-0" onClick={() => router.push("/reset-password")}>
              Forgot your password?
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AuthForm
