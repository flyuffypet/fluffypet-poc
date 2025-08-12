"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function JoinOrgPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [token, setToken] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const tParam = params.get("token")

  useEffect(() => {
    if (tParam) setToken(tParam)
  }, [tParam])

  async function acceptInvite() {
    setStatus("Processing invite...")
    try {
      const res = await fetch("/api/rpc/accept-invite", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setStatus("Invite accepted. Redirecting...")
      router.replace("/switch")
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg p-4 space-y-3">
      <h1 className="text-2xl font-semibold">Accept invite</h1>
      <p className="text-sm text-muted-foreground">Paste your invite token or open the invite link you received.</p>
      <div className="flex gap-2">
        <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Invite token" />
        <Button onClick={acceptInvite} disabled={!token}>
          Accept
        </Button>
      </div>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  )
}
