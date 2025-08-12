"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function VisibilityToggles({
  petId,
  initial,
}: { petId: string; initial?: "private" | "org_only" | "public" }) {
  const supabase = getSupabaseBrowserClient()
  const [mode, setMode] = useState<"private" | "org_only" | "public">(initial || "private")

  async function set(value: "private" | "org_only" | "public") {
    setMode(value)
    await supabase.from("pets").update({ visibility: value }).eq("id", petId)
  }

  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="text-sm font-semibold">Visibility</div>
      <div className="flex items-center justify-between">
        <Label htmlFor="vis-private">Private</Label>
        <Switch id="vis-private" checked={mode === "private"} onCheckedChange={(on) => on && set("private")} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="vis-org">Org only</Label>
        <Switch id="vis-org" checked={mode === "org_only"} onCheckedChange={(on) => on && set("org_only")} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="vis-public">Public</Label>
        <Switch id="vis-public" checked={mode === "public"} onCheckedChange={(on) => on && set("public")} />
      </div>
    </div>
  )
}
