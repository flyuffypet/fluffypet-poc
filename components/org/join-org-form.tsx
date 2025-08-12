"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function JoinOrgForm() {
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  async function acceptInvite(formData: FormData) {
    "use server"
    const token = String(formData.get("token") || "")
    const { getSupabaseServerClient } = await import("@/lib/supabase-server")
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.rpc("accept_invite", { p_token: token })
    if (error) throw error
  }

  return (
    <form action={acceptInvite} className="space-y-3">
      <Input name="token" placeholder="Invite token" value={token} onChange={(e) => setToken(e.target.value)} />
      <Button type="submit">Join organization</Button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </form>
  )
}
