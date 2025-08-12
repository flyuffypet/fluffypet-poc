"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

type MediaRow = {
  id: string
  pet_id: string
  type: string
  filename?: string | null
  path: string
  mime_type?: string | null
  created_at: string
}

export default function MediaGrid({ petId }: { petId: string }) {
  const supabase = getSupabaseBrowserClient()
  const [items, setItems] = useState<MediaRow[]>([])
  const [signed, setSigned] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancel = false
    async function load() {
      const { data } = await supabase
        .from("pet_media")
        .select("*")
        .eq("pet_id", petId)
        .order("created_at", { ascending: false })
        .limit(60)
      if (!cancel) setItems(data || [])
    }
    load()
    return () => {
      cancel = true
    }
  }, [petId, supabase])

  useEffect(() => {
    let cancel = false
    async function signAll() {
      const out: Record<string, string> = {}
      for (const m of items) {
        const { data } = await supabase.storage.from("pet-media").createSignedUrl(m.path, 60 * 10)
        if (data?.signedUrl) out[m.id] = data.signedUrl
      }
      if (!cancel) setSigned(out)
    }
    if (items.length) signAll()
    return () => {
      cancel = true
    }
  }, [items, supabase])

  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">No media yet.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((m) => (
        <a key={m.id} href={signed[m.id] || "#"} target="_blank" rel="noopener noreferrer" className="group">
          <div className="overflow-hidden rounded-md border bg-muted">
            <Image
              src={"/placeholder.svg?height=300&width=400&query=media+tile"}
              alt={m.filename || "Media"}
              width={400}
              height={300}
              className="h-40 w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="mt-1 truncate text-xs text-muted-foreground">{m.filename || m.path.split("/").pop()}</div>
        </a>
      ))}
    </div>
  )
}
