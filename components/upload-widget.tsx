"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UploadWidget() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<string>("")

  async function onUpload() {
    try {
      if (!file) return
      setStatus("Requesting upload URL...")
      const res = await fetch("/api/blob/generate-upload-url", { method: "POST" })
      if (!res.ok) throw new Error("Failed to get upload URL")
      const data = await res.json()
      const uploadUrl = data.url as string

      setStatus("Uploading...")
      const up = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      })
      if (!up.ok) throw new Error("Upload failed")

      // The uploadUrl responds with the public or private blob URL in a header
      const blobUrl = up.headers.get("location") || "(uploaded)"
      setStatus(`Uploaded: ${blobUrl}`)
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button onClick={onUpload} disabled={!file}>
          {"Upload"}
        </Button>
      </div>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  )
}
