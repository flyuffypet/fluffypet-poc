import { authFunctions } from "@/lib/edge-functions"
import { redirect } from "next/navigation"

export async function signIn(email: string, password: string) {
  try {
    const result = await authFunctions.signIn(email, password)

    if (result.error) {
      return { error: result.error }
    }

    return { success: true, redirectTo: "/dashboard" }
  } catch (error: any) {
    return { error: error.message || "Sign in failed" }
  }
}

export async function signUp(email: string, password: string) {
  try {
    const result = await authFunctions.signUp(email, password, {
      email,
      first_name: "",
      last_name: "",
    })

    if (result.error) {
      return { error: result.error }
    }

    return {
      success: "Account created! Please check your email to verify your account.",
      redirectTo: "/login",
    }
  } catch (error: any) {
    return { error: error.message || "Sign up failed" }
  }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters")
  }

  try {
    // This would typically get the auth token from the session
    // For now, we'll assume it's handled by the Edge Function
    const result = await authFunctions.updatePassword(password, "")

    if (result.error) {
      throw new Error(result.error)
    }

    redirect("/dashboard")
  } catch (error: any) {
    throw new Error(error.message || "Failed to update password")
  }
}

export async function resetPassword(email: string) {
  try {
    const result = await authFunctions.resetPassword(email)

    if (result.error) {
      return { error: result.error }
    }

    return { success: "Password reset email sent!" }
  } catch (error: any) {
    return { error: error.message || "Failed to send reset email" }
  }
}
