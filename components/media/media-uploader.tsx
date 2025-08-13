"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File, ImageIcon } from "lucide-react"
import { storageService } from "@/lib/storage"
import { createClient } from "@/lib/supabase-client"

interface MediaFile {
  id: string
  file: File
  preview?: string
  progress: number
  uploaded: boolean
  error?: string
  path?: string
  url?: string
}

interface MediaUploaderProps {
  petId: string
  mediaType?: "photos" | "documents" | "medical"
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  onUploadComplete?: (files: { path: string; url: string; type: string }[]) => void
  onUploadError?: (error: string) => void
}

export function MediaUploader({
  petId,
  mediaType = "photos",
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx"],
  onUploadComplete,
  onUploadError,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string>("")
  const supabase = createClient()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError("")

      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const newFiles: MediaFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        progress: 0,
        uploaded: false,
      }))

      setFiles((prev) => [...prev, ...newFiles])
    },
    [files.length, maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxSize,
    disabled: isUploading,
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

    setIsUploading(true)
    setError("")

    const uploadPromises = files
      .filter((f) => !f.uploaded)
      .map(async (mediaFile) => {
        try {
          // Update progress
          setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: 10 } : f)))

          // Generate unique path
          const path = storageService.generatePath(petId, mediaFile.file.name, mediaType)

          // Upload to Supabase Storage
          const result = await storageService.uploadFile(mediaFile.file, path)

          if (result.error) {
            throw new Error(result.error)
          }

          // Update progress
          setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: 70 } : f)))

          // Save media record to database
          const { error: dbError } = await supabase.from("pet_media").insert({
            pet_id: petId,
            type: mediaType,
            filename: mediaFile.file.name,
            path: result.path,
            url: result.url,
            file_size: mediaFile.file.size,
            mime_type: mediaFile.file.type,
          })

          if (dbError) {
            throw new Error(dbError.message)
          }

          // Update progress to complete
          setFiles((prev) =>
            prev.map((f) =>
              f.id === mediaFile.id
                ? {
                    ...f,
                    progress: 100,
                    uploaded: true,
                    path: result.path,
                    url: result.url,
                  }
                : f,
            ),
          )

          return {
            path: result.path,
            url: result.url,
            type: mediaFile.file.type,
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Upload failed"

          setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, error: errorMessage, progress: 0 } : f)))

          throw error
        }
      })

    try {
      const results = await Promise.all(uploadPromises)
      onUploadComplete?.(results)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Some uploads failed"
      setError(errorMessage)
      onUploadError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setError("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
            } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500 mb-4">or click to select files</p>
            <p className="text-xs text-gray-400">
              Max {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Files ({files.length})</h3>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={clearAll} disabled={isUploading}>
                  Clear All
                </Button>
                <Button onClick={uploadFiles} disabled={isUploading || files.every((f) => f.uploaded)} size="sm">
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                        {file.file.type.startsWith("image/") ? (
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <File className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.file.name}</p>
                    <p className="text-xs text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>

                    {file.progress > 0 && !file.uploaded && !file.error && (
                      <Progress value={file.progress} className="mt-2" />
                    )}

                    {file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>}

                    {file.uploaded && <p className="text-xs text-green-500 mt-1">Uploaded successfully</p>}
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default MediaUploader
