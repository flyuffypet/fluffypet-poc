"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, File, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  file: File
  preview?: string
  progress: number
  uploaded: boolean
  url?: string
  error?: string
}

interface MediaUploaderProps {
  petId?: string
  onUpload?: (files: { url: string; path: string }[]) => void
  onUploaded?: () => void
  onError?: (error: string) => void
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  className?: string
}

export default function MediaUploader({
  petId,
  onUpload,
  onUploaded,
  onError,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    "application/pdf": [".pdf"],
  },
  className,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: MediaFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substring(2),
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
    onError: (error) => {
      onError?.(error.message)
    },
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

    try {
      for (const mediaFile of files) {
        if (mediaFile.uploaded) continue

        // Simulate upload progress
        setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: 10 } : f)))

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: 50 } : f)))

        // Simulate completion
        const mockUrl = URL.createObjectURL(mediaFile.file)
        const mockPath = `pets/${petId || "default"}/${mediaFile.file.name}`

        setFiles((prev) =>
          prev.map((f) => (f.id === mediaFile.id ? { ...f, uploaded: true, progress: 100, url: mockUrl } : f)),
        )
        uploadedFiles.push({ url: mockUrl, path: mockPath })
      }

      if (uploadedFiles.length > 0) {
        onUpload?.(uploadedFiles)
        onUploaded?.()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed"
      onError?.(message)
    } finally {
      setUploading(false)
    }
  }

  const clearAll = () => {
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-500">
              Max {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Files ({files.length})</h4>
            <div className="space-x-2">
              <Button onClick={uploadFiles} disabled={uploading || files.every((f) => f.uploaded)} size="sm">
                {uploading ? "Uploading..." : "Upload All"}
              </Button>
              <Button onClick={clearAll} variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
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
                  <p className="text-sm text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>

                  {file.progress > 0 && !file.uploaded && <Progress value={file.progress} className="mt-1" />}

                  {file.error && <p className="text-sm text-red-600 mt-1">{file.error}</p>}

                  {file.uploaded && <p className="text-sm text-green-600 mt-1">Uploaded</p>}
                </div>

                <Button onClick={() => removeFile(file.id)} variant="ghost" size="sm" className="flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
