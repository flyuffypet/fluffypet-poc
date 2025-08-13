"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase-client"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"request" | "update">("request")
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const modeParam = searchParams.get("mode")
    const accessTokenParam = searchParams.get("access_token")

    if (modeParam === "update" && accessTokenParam) {
      setMode("update")
      setAccessToken(accessTokenParam)

      // Set the session with the access token
      supabase.auth.setSession({
        access_token: accessTokenParam,
        refresh_token: searchParams.get("refresh_token") || "",
      })
    }
  }, [searchParams, supabase.auth])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {mode === "update" ? "Update Password" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === "update"
                ? "Enter your new password below"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm mode={mode} accessToken={accessToken} />
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Remember your password? </span>
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
