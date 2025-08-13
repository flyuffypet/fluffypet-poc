"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload, ImageIcon, Image } from "lucide-react"
import { storageService } from "@/lib/storage"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  progress: number
  status: "uploading" | "completed" | "error"
}

interface MediaUploaderProps {
  bucket: string
  path?: string
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: Error) => void
}

export default function MediaUploader({
  bucket,
  path = "",
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "application/pdf"],
  onUploadComplete,
  onUploadError,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const fileId = Math.random().toString(36).substring(7)
    const fileName = `${Date.now()}-${file.name}`
    const filePath = path ? `${path}/${fileName}` : fileName

    const uploadedFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading",
    }

    setFiles((prev) => [...prev, uploadedFile])

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress: Math.min(f.progress + 10, 90) } : f)))
      }, 200)

      const result = await storageService.uploadFile(bucket, filePath, file)

      clearInterval(progressInterval)

      if (result.error) {
        throw result.error
      }

      const publicUrl = await storageService.getPublicUrl(bucket, filePath)

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                progress: 100,
                status: "completed" as const,
                url: publicUrl,
              }
            : f,
        ),
      )

      return {
        ...uploadedFile,
        progress: 100,
        status: "completed",
        url: publicUrl,
      }
    } catch (error) {
      setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error" as const } : f)))
      throw error
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        onUploadError?.(new Error(`Maximum ${maxFiles} files allowed`))
        return
      }

      setIsUploading(true)

      try {
        const uploadPromises = acceptedFiles.map(uploadFile)
        const uploadedFiles = await Promise.all(uploadPromises)
        onUploadComplete?.(uploadedFiles)
      } catch (error) {
        onUploadError?.(error as Error)
      } finally {
        setIsUploading(false)
      }
    },
    [files.length, maxFiles, onUploadComplete, onUploadError],
  )

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    disabled: isUploading,
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">Drag & drop files here, or click to select files</p>
                <p className="text-sm text-gray-500">
                  Maximum {maxFiles} files, up to {formatFileSize(maxSize)} each
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-4">Uploaded Files</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {file.type.startsWith("image/") ? (
                    <Image className="h-8 w-8 text-blue-500" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    {file.status === "uploading" && <Progress value={file.progress} className="mt-2" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === "completed" && <span className="text-green-600 text-sm">✓</span>}
                    {file.status === "error" && <span className="text-red-600 text-sm">✗</span>}
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} disabled={isUploading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
