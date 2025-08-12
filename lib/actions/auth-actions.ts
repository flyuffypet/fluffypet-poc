"use server"

import { createServerClient } from "@/lib/supabase-server"
import { getAuthConfig } from "@/lib/auth-config"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()
  const config = getAuthConfig()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${config.siteUrl}/auth/callback?next=/onboarding`,
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user && !data.user.email_confirmed_at) {
    return {
      success: true,
      message: "Please check your email to confirm your account",
      needsConfirmation: true,
    }
  }

  return { success: true, user: data.user }
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to dashboard after successful login
  redirect("/dashboard")
}

export async function signOutAction() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  const supabase = createServerClient()
  const config = getAuthConfig()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.siteUrl}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: "Password reset email sent. Please check your inbox.",
  }
}

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" }
  }

  const supabase = createServerClient()

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: "Password updated successfully",
  }
}

export async function signInWithOAuthAction(provider: "google" | "github") {
  const supabase = createServerClient()
  const headersList = headers()
  const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }

  return { error: "Failed to initiate OAuth sign in" }
}

export async function resendConfirmationAction(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required" }
  }

  const supabase = createServerClient()
  const config = getAuthConfig()

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${config.siteUrl}/auth/callback?next=/onboarding`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: "Confirmation email resent. Please check your inbox.",
  }
}
