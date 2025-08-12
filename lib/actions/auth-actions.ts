"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getSignupRedirectUrl } from "@/lib/auth-config"

function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createSupabaseServerClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Sign in error:", error)
      return { error: error.message }
    }

    if (data.user) {
      // Check if profile exists and get role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, platform_role, default_org_id")
        .eq("id", data.user.id)
        .single()

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, create it
        const { error: createError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name || "User",
          last_name: data.user.user_metadata?.last_name || "Name",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (createError) {
          console.error("Profile creation error:", createError)
          return { error: "Failed to create user profile" }
        }

        revalidatePath("/")
        return { success: true, redirectTo: "/onboarding" }
      }

      if (profile) {
        const role = profile.role || profile.platform_role

        if (!role) {
          revalidatePath("/")
          return { success: true, redirectTo: "/onboarding" }
        }

        // Role-based dashboard redirection
        revalidatePath("/")
        let redirectTo = "/dashboard"
        switch (role) {
          case "service_provider":
            redirectTo = "/provider/dashboard"
            break
          case "veterinarian":
            redirectTo = "/vet/dashboard"
            break
          case "admin":
            redirectTo = profile.default_org_id ? "/clinic/dashboard" : "/admin/dashboard"
            break
          case "volunteer":
            redirectTo = "/volunteer/dashboard"
            break
          case "platform_admin":
          case "superadmin":
            redirectTo = "/admin/dashboard"
            break
          default:
            redirectTo = "/dashboard" // pet_owner
            break
        }
        return { success: true, redirectTo }
      }
    }

    return { success: true, redirectTo: "/dashboard" }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(email: string, password: string) {
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createSupabaseServerClient()

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSignupRedirectUrl(),
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      return { error: error.message }
    }

    if (data.user && !data.session) {
      return { success: "Check your email and click the confirmation link to complete your registration." }
    } else if (data.session) {
      // User is immediately signed in (email confirmation disabled)
      // Create profile
      const { error: createError } = await supabase.from("profiles").insert({
        id: data.user!.id,
        email: data.user!.email,
        first_name: data.user!.user_metadata?.first_name || "User",
        last_name: data.user!.user_metadata?.last_name || "Name",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (createError) {
        console.error("Profile creation error:", createError)
        return { error: "Account created but failed to create profile. Please contact support." }
      }

      revalidatePath("/")
      return { success: true, redirectTo: "/onboarding" }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function updateUserRole(formData: FormData) {
  const role = formData.get("role") as string
  const orgType = formData.get("orgType") as string

  if (!role) {
    return { error: "Role is required" }
  }

  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      const { error: createError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (createError) {
        console.error("Profile creation error:", createError)
        return { error: "Failed to create user profile" }
      }
    } else {
      // Update existing profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
        return { error: "Failed to update profile" }
      }
    }

    if (role === "admin" && orgType) {
      revalidatePath("/onboarding")
      redirect(`/org/new?type=${orgType}`)
    }

    revalidatePath("/onboarding")

    switch (role) {
      case "service_provider":
        redirect("/provider/dashboard")
        break
      case "veterinarian":
        redirect("/vet/dashboard")
        break
      case "volunteer":
        redirect("/volunteer/dashboard")
        break
      case "admin":
        redirect("/admin/dashboard")
        break
      default:
        redirect("/dashboard")
        break
    }
  } catch (error) {
    console.error("Role update error:", error)
    return { error: "Failed to update role" }
  }
}

export async function signOut() {
  const supabase = createSupabaseServerClient()

  await supabase.auth.signOut()
  revalidatePath("/")
  redirect("/")
}

export async function completeOnboarding() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      return { error: "Failed to complete onboarding" }
    }

    revalidatePath("/onboarding")
    redirect("/dashboard")
  } catch (error) {
    console.error("Onboarding completion error:", error)
    return { error: "Failed to complete onboarding" }
  }
}

export async function resetPassword(email: string) {
  if (!email) {
    return { error: "Email is required" }
  }

  const supabase = createSupabaseServerClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
    })

    if (error) {
      console.error("Password reset error:", error)
      return { error: error.message }
    }

    return { success: "Check your email for password reset instructions." }
  } catch (error) {
    console.error("Password reset error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
