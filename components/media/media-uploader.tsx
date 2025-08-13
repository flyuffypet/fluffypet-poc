"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileImage, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MediaFile {
  id: string
  file: File
  preview?: string
  progress: number
  status: "uploading" | "completed" | "error"
  url?: string
}

interface MediaUploaderProps {
  onUpload?: (files: MediaFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
}

export default function MediaUploader({
  onUpload,
  maxFiles = 10,
  acceptedTypes = ["image/*", "application/pdf"],
  className,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: MediaFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((mediaFile) => {
      simulateUpload(mediaFile)
    })
  }, [])

  const simulateUpload = async (mediaFile: MediaFile) => {
    setIsUploading(true)

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setFiles((prev) => prev.map((f) => (f.id === mediaFile.id ? { ...f, progress } : f)))
    }

    // Mark as completed
    setFiles((prev) =>
      prev.map((f) =>
        f.id === mediaFile.id
          ? {
              ...f,
              status: "completed" as const,
              url: `https://example.com/uploads/${mediaFile.file.name}`,
            }
          : f,
      ),
    )

    setIsUploading(false)

    // Call onUpload callback
    if (onUpload) {
      const completedFiles = files.filter((f) => f.status === "completed")
      onUpload(completedFiles)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((f) => f.id !== id)
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
    maxFiles: maxFiles - files.length,
    disabled: isUploading,
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          isUploading && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-muted-foreground">Supports images and PDFs (max {maxFiles} files)</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium">Uploading Files</h3>
          {files.map((mediaFile) => (
            <Card key={mediaFile.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {mediaFile.preview ? (
                      <img
                        src={mediaFile.preview || "/placeholder.svg"}
                        alt={mediaFile.file.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : mediaFile.file.type === "application/pdf" ? (
                      <File className="h-12 w-12 text-red-500" />
                    ) : (
                      <FileImage className="h-12 w-12 text-gray-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{mediaFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">{(mediaFile.file.size / 1024 / 1024).toFixed(2)} MB</p>

                    {mediaFile.status === "uploading" && (
                      <div className="mt-2">
                        <Progress value={mediaFile.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{mediaFile.progress}% uploaded</p>
                      </div>
                    )}

                    {mediaFile.status === "completed" && (
                      <p className="text-xs text-green-600 mt-1">Upload completed</p>
                    )}

                    {mediaFile.status === "error" && <p className="text-xs text-red-600 mt-1">Upload failed</p>}
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => removeFile(mediaFile.id)} disabled={isUploading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
