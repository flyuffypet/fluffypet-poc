"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { storageService } from "@/lib/storage"
import { Upload, X, ImageIcon, ImageIcon as ImageIcon2, CheckCircle, AlertCircle } from "lucide-react"

interface MediaFile {
  id: string
  file: File
  preview?: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
  url?: string
  error?: string
}

interface MediaUploaderProps {
  bucket: string
  path?: string
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  onUploadComplete?: (files: { url: string; path: string }[]) => void
  onUploadError?: (error: string) => void
}

export default function MediaUploader({
  bucket,
  path,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "video/*", "application/pdf"],
  onUploadComplete,
  onUploadError,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: MediaFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        status: "pending",
        progress: 0,
      }))

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles))
    },
    [maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
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

    setIsUploading(true)
    const uploadPromises = files.map(async (mediaFile) => {
      if (mediaFile.status !== "pending") return null

      setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, status: "uploading", progress: 0 } : f)))

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => (f.id === mediaFile.id ? { ...f, progress: Math.min(f.progress + 10, 90) } : f)),
          )
        }, 200)

        const result = await storageService.uploadFile(mediaFile.file, bucket, path)

        clearInterval(progressInterval)

        if (result.error) {
          setFiles((prev) =>
            prev.map((f) => (f.id === mediaFile.id ? { ...f, status: "error", progress: 0, error: result.error } : f)),
          )
          return null
        }

        setFiles((prev) =>
          prev.map((f) => (f.id === mediaFile.id ? { ...f, status: "success", progress: 100, url: result.url } : f)),
        )

        return { url: result.url, path: result.path }
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === mediaFile.id
              ? {
                  ...f,
                  status: "error",
                  progress: 0,
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        )
        return null
      }
    })

    try {
      const results = await Promise.all(uploadPromises)
      const successfulUploads = results.filter((result) => result !== null) as {
        url: string
        path: string
      }[]

      if (successfulUploads.length > 0) {
        onUploadComplete?.(successfulUploads)
      }

      const hasErrors = files.some((f) => f.status === "error")
      if (hasErrors) {
        onUploadError?.("Some files failed to upload")
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Upload failed")
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
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon2 className="h-4 w-4" />
    return <ImageIcon className="h-4 w-4" />
  }

  const getStatusIcon = (status: MediaFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">
                  Max {maxFiles} files, up to {Math.round(maxSize / 1024 / 1024)}MB each
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fileRejections.map((rejection, index) => (
              <div key={index}>
                {rejection.file.name}: {rejection.errors.map((e) => e.message).join(", ")}
              </div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Files ({files.length})</h3>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={clearAll} disabled={isUploading}>
                Clear All
              </Button>
              <Button
                onClick={uploadFiles}
                disabled={isUploading || files.every((f) => f.status !== "pending")}
                size="sm"
              >
                {isUploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {files.map((mediaFile) => (
              <Card key={mediaFile.id}>
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    {mediaFile.preview ? (
                      <img
                        src={mediaFile.preview || "/placeholder.svg"}
                        alt={mediaFile.file.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(mediaFile.file)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{mediaFile.file.name}</p>
                      <p className="text-xs text-gray-500">{(mediaFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {mediaFile.status === "uploading" && <Progress value={mediaFile.progress} className="mt-1" />}
                      {mediaFile.error && <p className="text-xs text-red-500 mt-1">{mediaFile.error}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusIcon(mediaFile.status)}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(mediaFile.id)} disabled={isUploading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
