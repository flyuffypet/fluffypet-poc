"use client"

import type React from "react"
import { Suspense } from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Logo } from "@/components/ui/logo"
import ResetPasswordForm from "@/components/auth/reset-password-form"

function ResetPasswordContent({ password, confirmPassword, loading, error, success, handleSubmit }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto mb-4" />
          {success ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Password Updated!</h1>
              <p className="text-gray-600 mt-2">
                Your password has been successfully updated. Redirecting to dashboard...
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
              <p className="text-gray-600 mt-2">We'll help you get back into your account</p>
            </>
          )}
        </div>

        {!success && (
          <ResetPasswordForm
            password={password}
            confirmPassword={confirmPassword}
            loading={loading}
            error={error}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      }
    >
      <ResetPasswordContent
        password={password}
        confirmPassword={confirmPassword}
        loading={loading}
        error={error}
        success={success}
        handleSubmit={handleSubmit}
      />
    </Suspense>
  )
}
