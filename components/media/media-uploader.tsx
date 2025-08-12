"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileImage, FileText, File } from "lucide-react"
import { storageService } from "@/lib/storage"

interface MediaUploaderProps {
  bucket: string
  path?: string
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  error?: string
  url?: string
}

export function MediaUploader({
  bucket,
  path = "",
  onUploadComplete,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ["image/*", "application/pdf", ".doc", ".docx"],
  className = "",
}: MediaUploaderProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null)

      if (acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`)
        return
      }

      const newUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
      }))

      setUploadingFiles(newUploadingFiles)

      const uploadPromises = acceptedFiles.map(async (file, index) => {
        try {
          const fileName = `${Date.now()}-${file.name}`
          const filePath = path ? `${path}/${fileName}` : fileName

          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setUploadingFiles((prev) =>
              prev.map((item, i) => (i === index ? { ...item, progress: Math.min(item.progress + 10, 90) } : item)),
            )
          }, 200)

          const uploadResult = await storageService.uploadFile(bucket, filePath, file)

          clearInterval(progressInterval)

          const signedUrl = await storageService.getSignedUrl(bucket, filePath)

          setUploadingFiles((prev) =>
            prev.map((item, i) => (i === index ? { ...item, progress: 100, url: signedUrl } : item)),
          )

          return signedUrl
        } catch (error) {
          setUploadingFiles((prev) => prev.map((item, i) => (i === index ? { ...item, error: "Upload failed" } : item)))
          throw error
        }
      })

      try {
        const urls = await Promise.all(uploadPromises)
        onUploadComplete?.(urls.filter(Boolean))
      } catch (error) {
        console.error("Upload error:", error)
        setError("Some files failed to upload")
      }
    },
    [bucket, path, maxFiles, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce(
      (acc, type) => {
        acc[type] = []
        return acc
      },
      {} as Record<string, string[]>,
    ),
  })

  const removeFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-4 w-4" />
    } else if (file.type === "application/pdf") {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
          hover:border-primary hover:bg-primary/5
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? "Drop the files here..." : `Drag & drop files here, or click to select files`}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Max {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              {getFileIcon(item.file)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.file.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={item.progress} className="flex-1" />
                  <span className="text-xs text-muted-foreground">{item.progress}%</span>
                </div>
                {item.error && <p className="text-xs text-destructive mt-1">{item.error}</p>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
