"use client"

import AuthForm from "@/components/auth/auth-form"

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md p-4">
      <h1 className="mb-4 text-2xl font-semibold">Create your account</h1>
      <AuthForm mode="signup" />
    </div>
  )
}
