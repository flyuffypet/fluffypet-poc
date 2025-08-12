"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") || "")
  const region = String(formData.get("region") || "")
  const orgType = String(formData.get("org_type") || "clinic")

  if (!name.trim()) {
    throw new Error("Organization name is required")
  }

  const supabase = getSupabaseServerClient()
  const userRes = await supabase.auth.getUser()
  const user = userRes.data.user

  if (!user) {
    throw new Error("User not authenticated")
  }

  try {
    // Insert org
    const { data: org, error: orgErr } = await supabase
      .from("organizations")
      .insert({
        name: name.trim(),
        region: region.trim(),
        org_type: orgType,
        created_by: user.id,
        verified_status: "pending",
      })
      .select("id")
      .single()

    if (orgErr) throw orgErr

    // Add membership as admin
    const { error: memberErr } = await supabase.from("organization_users").insert({
      org_id: org.id,
      user_id: user.id,
      role: "admin",
      status: "active",
    })

    if (memberErr) throw memberErr

    // Set default org on profile
    const { error: profileErr } = await supabase.from("profiles").update({ default_org_id: org.id }).eq("id", user.id)

    if (profileErr) throw profileErr

    return { success: true, orgId: org.id }
  } catch (error) {
    console.error("Error creating organization:", error)
    throw new Error("Failed to create organization")
  }
}
