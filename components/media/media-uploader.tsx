"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File } from "lucide-react"
import { storageService } from "@/lib/storage"

interface MediaUploaderProps {
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
  acceptedFileTypes?: string[]
  bucket?: string
  folder?: string
}

export function MediaUploader({
  onUploadComplete,
  maxFiles = 5,
  acceptedFileTypes = ["image/*", "application/pdf"],
  bucket = "pet-media",
  folder,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, maxFiles))
      setError("")
    },
    [maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)
    setError("")

    try {
      const uploadPromises = files.map(async (file, index) => {
        const result = await storageService.uploadFile(file, bucket, folder)
        setProgress(((index + 1) / files.length) * 100)
        return await storageService.getSignedUrl(result.path, bucket)
      })

      const urls = await Promise.all(uploadPromises)
      onUploadComplete?.(urls)
      setFiles([])
      setProgress(100)
    } catch (err) {
      setError("Failed to upload files. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p>Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg font-medium">Drop files here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxFiles} files. Accepted: {acceptedFileTypes.join(", ")}
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center">Uploading... {Math.round(progress)}%</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && !uploading && (
        <Button onClick={uploadFiles} className="w-full">
          Upload {files.length} file{files.length > 1 ? "s" : ""}
        </Button>
      )}
    </div>
  )
}

export default MediaUploader
