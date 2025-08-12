"use client"

import AuthForm from "@/components/auth/auth-form"

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">Sign in</h1>
      <AuthForm mode="signin" />
    </div>
  )
}
