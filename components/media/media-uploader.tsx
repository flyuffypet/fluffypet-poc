"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon, Video } from "lucide-react"
import { storageService } from "@/lib/storage"

interface MediaFile {
  id: string
  file: File
  preview?: string
  progress: number
  uploaded: boolean
  error?: string
  url?: string
}

interface MediaUploaderProps {
  bucket: string
  path?: string
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  onUploadComplete?: (files: { url: string; path: string }[]) => void
  onUploadError?: (error: string) => void
}

export default function MediaUploader({
  bucket,
  path = "",
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "video/*": [".mp4", ".webm", ".ogg"],
    "application/pdf": [".pdf"],
  },
  onUploadComplete,
  onUploadError,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: MediaFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(7),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
        uploaded: false,
      }))

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles))
    },
    [maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: maxFiles > 1,
  })

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    const uploadedFiles: { url: string; path: string }[] = []

    for (const mediaFile of files) {
      if (mediaFile.uploaded) continue

      try {
        setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: 10 } : f)))

        const fileName = `${Date.now()}-${mediaFile.file.name}`
        const filePath = path ? `${path}/${fileName}` : fileName

        setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: 50 } : f)))

        const result = await storageService.uploadFile(bucket, filePath, mediaFile.file)

        if (result.error) {
          setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, error: result.error, progress: 0 } : f)))
          onUploadError?.(result.error)
        } else {
          setFiles((prev) =>
            prev.map((f) => (f.id === mediaFile.id ? { ...f, uploaded: true, progress: 100, url: result.url } : f)),
          )
          uploadedFiles.push({ url: result.url, path: result.path })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed"
        setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, error: errorMessage, progress: 0 } : f)))
        onUploadError?.(errorMessage)
      }
    }

    setUploading(false)
    if (uploadedFiles.length > 0) {
      onUploadComplete?.(uploadedFiles)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />
    return <ImageIcon className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Max {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {files.map((mediaFile) => (
                <div key={mediaFile.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {mediaFile.preview ? (
                      <img
                        src={mediaFile.preview || "/placeholder.svg"}
                        alt={mediaFile.file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(mediaFile.file)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mediaFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(mediaFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    {mediaFile.progress > 0 && !mediaFile.uploaded && (
                      <Progress value={mediaFile.progress} className="mt-1" />
                    )}
                    {mediaFile.error && <p className="text-xs text-red-500 mt-1">{mediaFile.error}</p>}
                    {mediaFile.uploaded && <p className="text-xs text-green-500 mt-1">Uploaded successfully</p>}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(mediaFile.id)} disabled={uploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={uploadFiles} disabled={uploading || files.every((f) => f.uploaded)}>
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
