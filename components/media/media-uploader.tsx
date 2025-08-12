"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MediaUploader({ petId, onUploaded }: { petId: string; onUploaded?: () => void }) {
  const supabase = getSupabaseBrowserClient()
  const [files, setFiles] = useState<FileList | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function uploadAll() {
    if (!files || files.length === 0) return
    setLoading(true)
    setStatus("Uploading...")
    try {
      const now = new Date()
      const yyyy = String(now.getFullYear())
      const mm = String(now.getMonth() + 1).padStart(2, "0")
      const { data: auth } = await supabase.auth.getUser()
      const user = auth.user

      for (const f of Array.from(files)) {
        const ext = f.name.split(".").pop() || "bin"
        const obj = `${crypto.randomUUID()}.${ext}`
        const rel = `pet-media/${petId}/${yyyy}/${mm}/${obj}`
        const { data, error } = await supabase.storage.from("pet-media").upload(rel.replace(/^pet-media\//, ""), f, {
          upsert: false,
          contentType: f.type,
        })
        if (error) throw error

        await supabase.from("pet_media").insert({
          pet_id: petId,
          uploader_id: user?.id,
          type: f.type.includes("image")
            ? "image"
            : f.type.includes("video")
              ? "video"
              : f.type.includes("pdf")
                ? "pdf"
                : "report",
          filename: f.name,
          path: data.path,
          mime_type: f.type,
          size: f.size,
          metadata: {},
        })
      }
      setStatus("Uploaded.")
      onUploaded?.()
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <Button onClick={uploadAll} disabled={!files || loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </div>
  )
}
