import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { orgId } = await req.json()
    if (!orgId) return NextResponse.json({ error: "Missing orgId" }, { status: 400 })

    const supabase = getSupabaseServerClient()
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    // Must be an active member in the org
    const { data: membership } = await supabase
      .from("organization_users")
      .select("id")
      .eq("org_id", orgId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle()

    if (!membership) return NextResponse.json({ error: "Not a member of org" }, { status: 403 })

    await supabase.from("profiles").update({ default_org_id: orgId }).eq("id", user.id)

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
