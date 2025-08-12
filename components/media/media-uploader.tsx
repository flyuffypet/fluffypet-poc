"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, X, FileText, ImageIcon } from "lucide-react"
import { validateFile } from "@/lib/storage"

interface MediaUploaderProps {
  petId: string
  onUploaded?: (mediaId: string) => void
  accept?: string
  multiple?: boolean
  bucket?: string
}

export default function MediaUploader({
  petId,
  onUploaded,
  accept = "image/*,application/pdf,.doc,.docx",
  multiple = true,
  bucket = "pet-media",
}: MediaUploaderProps) {
  const supabase = createClient()
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      // Validate each file
      for (const file of Array.from(selectedFiles)) {
        const validation = validateFile(file)
        if (!validation.valid) {
          setStatus(`Error: ${validation.error}`)
          return
        }
      }
    }
    setFiles(selectedFiles)
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
      const totalFiles = files.length
      let completedFiles = 0

      for (const file of Array.from(files)) {
        // Generate unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${petId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (uploadError) {
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`)
        }

        // Determine media type
        const mediaType = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : file.type === "application/pdf" || file.type.includes("document")
              ? "document"
              : "other"

        // Get public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(uploadData.path)

        // Save media record to database
        const { data: mediaRecord, error: dbError } = await supabase
          .from("pet_media")
          .insert({
            pet_id: petId,
            type: mediaType,
            filename: file.name,
            path: uploadData.path,
            url: publicUrl,
            mime_type: file.type,
            size: file.size,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (dbError) {
          console.error("Database error:", dbError)
          // Continue with other files even if one fails
        }

        completedFiles++
        setProgress((completedFiles / totalFiles) * 100)

        if (onUploaded && mediaRecord) {
          onUploaded(mediaRecord.id)
        }
      }

      setStatus(`Successfully uploaded ${totalFiles} file(s)`)
      setFiles(null)

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error: any) {
      console.error("Upload error:", error)
      setStatus(`Error: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
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
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {Array.from(files).map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted rounded">
                {getFileIcon(file)}
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
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
