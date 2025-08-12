"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

export default function AvatarUploader({
  petId,
  onUploaded,
}: {
  petId: string
  onUploaded?: (path: string) => void
}) {
  const supabase = getSupabaseBrowserClient()
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function upload() {
    if (!file) return
    setLoading(true)
    setStatus("Uploading...")
    try {
      const now = new Date()
      const yyyy = String(now.getFullYear())
      const mm = String(now.getMonth() + 1).padStart(2, "0")
      const ext = file.name.split(".").pop() || "jpg"
      const objectName = `${crypto.randomUUID()}.${ext}`
      const path = `pet-media/${petId}/${yyyy}/${mm}/${objectName}`

      const { data, error } = await supabase.storage.from("pet-media").upload(path.replace(/^pet-media\//, ""), file, {
        upsert: false,
        contentType: file.type,
      })
      if (error) throw error

      // Insert pet_media row
      const { data: auth } = await supabase.auth.getUser()
      const user = auth.user
      await supabase.from("pet_media").insert({
        pet_id: petId,
        uploader_id: user?.id,
        type: "image",
        filename: file.name,
        path: data.path,
        mime_type: file.type,
        size: file.size,
        metadata: {},
      })

      setStatus("Uploaded.")
      onUploaded?.(data.path)
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={upload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </Button>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </div>
  )
}
