"use client"

import { Suspense } from "react"
import AuthForm from "@/components/auth/auth-form"
import { Logo } from "@/components/ui/logo"

function SignupContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Join FluffyPet</h1>
          <p className="text-gray-600 mt-2">Create your account to get started</p>
        </div>

        <AuthForm mode="signup" />
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  )
}
