"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function LinkSharePanel({ petId }: { petId: string }) {
  const supabase = getSupabaseBrowserClient()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    async function load() {
      const { data } = await supabase
        .from("pet_shares")
        .select("*")
        .eq("pet_id", petId)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (!cancel) setToken(data?.token || null)
    }
    load()
    return () => {
      cancel = true
    }
  }, [petId, supabase])

  async function createLink() {
    const t = crypto.randomUUID()
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    await supabase.from("pet_shares").insert({ pet_id: petId, token: t, role: "viewer", expires_at: expires })
    setToken(t)
  }

  async function revoke() {
    await supabase.from("pet_shares").delete().eq("pet_id", petId)
    setToken(null)
  }

  const url = token ? `${location.origin}/share/${token}` : ""

  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="text-sm font-semibold">Link-based sharing (24h)</div>
      {token ? (
        <>
          <Input readOnly value={url} />
          <div className="flex gap-2">
            <Button onClick={() => navigator.clipboard.writeText(url)}>Copy</Button>
            <Button variant="outline" className="bg-transparent" onClick={revoke}>
              Revoke
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={createLink}>Create link</Button>
      )}
    </div>
  )
}
