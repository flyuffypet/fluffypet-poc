"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { authConfig } from "@/lib/auth-config"

export async function signUp(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: authConfig.redirectUrls.callback,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/login?message=Check your email to confirm your account")
}

export async function signIn(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signOut() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/login")
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()

  const email = formData.get("email") as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: authConfig.redirectUrls.passwordReset,
  })

  if (error) {
    throw new Error(error.message)
  }

  return { message: "Password reset email sent" }
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient()

  const password = formData.get("password") as string

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/", "layout")
  redirect("/dashboard?message=Password updated successfully")
}
