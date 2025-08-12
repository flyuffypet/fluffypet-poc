import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const orgId = String(body.orgId || "")
    const email = String(body.email || "")
    const role = String(body.role || "staff")
    const note = String(body.note || "")

    if (!orgId || !email) {
      return NextResponse.json({ error: "orgId and email are required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { data: auth } = await supabase.auth.getUser()
    const user = auth.user
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    // Check admin membership (defense in depth; RLS also protects)
    const { data: admin } = await supabase
      .from("organization_users")
      .select("id")
      .eq("org_id", orgId)
      .eq("user_id", user.id)
      .eq("role", "admin")
      .eq("status", "active")
      .maybeSingle()
    if (!admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 })

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { error: insertErr } = await supabase.from("invites").insert({
      org_id: orgId,
      email,
      role,
      invited_by: user.id,
      token,
      expires_at: expires,
    })
    if (insertErr) throw insertErr

    // Optional email via Resend
    if (process.env.RESEND_API_KEY && process.env.NEXT_PUBLIC_SITE_URL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        const joinUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/org/join?token=${token}`
        await resend.emails.send({
          from: "FluffyPet <noreply@fluffypet.example>",
          to: email,
          subject: "You're invited to join an organization on FluffyPet",
          html: `<p>${note || "You've been invited to join an organization."}</p><p><a href="${joinUrl}">Accept Invite</a></p>`,
        })
      } catch {
        // ignore email failures in PoC
      }
    }

    return NextResponse.json({ ok: true, token })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
