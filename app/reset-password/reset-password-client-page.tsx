"use client"

import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordClientPage() {
  const searchParams = useSearchParams()
  const accessToken = searchParams.get("access_token")
  const refreshToken = searchParams.get("refresh_token")
  const type = searchParams.get("type")

  // If we have tokens and type is recovery, show update form
  if (accessToken && refreshToken && type === "recovery") {
    return <ResetPasswordForm mode="update" accessToken={accessToken} refreshToken={refreshToken} />
  }

  // Otherwise show request form
  return <ResetPasswordForm mode="request" />
}
