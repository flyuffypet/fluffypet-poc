"use client"

import type React from "react"
import { useState } from "react"
import { mediaFunctions, getCurrentUserToken } from "@/lib/edge-functions"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, X } from "lucide-react"

interface MediaUploaderProps {
  petId: string
  onUploaded?: (mediaId: string) => void
  accept?: string
  multiple?: boolean
}

export default function MediaUploader({
  petId,
  onUploaded,
  accept = "image/*,application/pdf",
  multiple = true,
}: MediaUploaderProps) {
  const supabase = getSupabaseBrowserClient()
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
    setStatus(null)
    setProgress(0)
  }

  const removeFiles = () => {
    setFiles(null)
    setStatus(null)
    setProgress(0)
  }

  const uploadFiles = async () => {
    if (!files || files.length === 0) return

    setUploading(true)
    setStatus("Uploading files...")

    try {
      const authToken = await getCurrentUserToken()
      if (!authToken) {
        throw new Error("Authentication required")
      }

      const totalFiles = files.length
      let completedFiles = 0

      for (const file of Array.from(files)) {
        // Generate upload URL via Edge Function
        const { uploadUrl, filePath } = await mediaFunctions.generateUploadUrl(
          file.name,
          file.type,
          `pet-media/${petId}`,
          authToken,
        )

        // Upload file to Supabase Storage
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error(`Upload failed for ${file.name}`)
        }

        // Determine media type
        const mediaType = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type === "application/pdf"
              ? "document"
              : "other"

        // Get public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(filePath)

        // Save media record via Edge Function
        const { media } = await mediaFunctions.saveMediaRecord(
          petId,
          mediaType,
          file.name,
          filePath,
          publicUrlData.publicUrl,
          authToken,
        )

        completedFiles++
        setProgress((completedFiles / totalFiles) * 100)

        if (onUploaded && media) {
          onUploaded(media.id)
        }
      }

      setStatus(`Successfully uploaded ${totalFiles} file(s)`)
      setFiles(null)
    } catch (error: any) {
      console.error("Upload error:", error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="flex-1"
        />
        {files && (
          <Button variant="outline" size="sm" onClick={removeFiles} disabled={uploading}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {files && files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{files.length} file(s) selected</div>
          <div className="space-y-1">
            {Array.from(files).map((file, index) => (
              <div key={index} className="text-xs text-muted-foreground truncate">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-muted-foreground">{progress.toFixed(0)}% complete</div>
        </div>
      )}

      {status && (
        <div className={`text-sm ${status.startsWith("Error") ? "text-destructive" : "text-green-600"}`}>{status}</div>
      )}

      <Button onClick={uploadFiles} disabled={!files || files.length === 0 || uploading} className="w-full">
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Uploading..." : `Upload ${files?.length || 0} file(s)`}
      </Button>
    </div>
  )
}
