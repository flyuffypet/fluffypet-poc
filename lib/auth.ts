import { createServerClient } from "@/lib/supabase-server"

export async function getCurrentUser() {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      ...profile,
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
