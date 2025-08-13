"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, File, ImageIcon, Video, FileText } from "lucide-react"
import { storageService } from "@/lib/storage"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
}

interface MediaUploaderProps {
  bucket: string
  path?: string
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  className?: string
}

export default function MediaUploader({
  bucket,
  path = "",
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ["image/*", "video/*", "application/pdf"],
  onUploadComplete,
  onUploadError,
  className = "",
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File ${file.name} is too large. Maximum size is ${maxSize}MB.`
    }

    const isValidType = acceptedTypes.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      return `File ${file.name} has an unsupported format.`
    }

    return null
  }

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles)
      const validFiles: File[] = []
      let errorMessage = ""

      for (const file of fileArray) {
        if (files.length + validFiles.length >= maxFiles) {
          errorMessage = `Maximum ${maxFiles} files allowed.`
          break
        }

        const validation = validateFile(file)
        if (validation) {
          errorMessage = validation
          break
        }

        validFiles.push(file)
      }

      if (errorMessage) {
        setError(errorMessage)
        onUploadError?.(errorMessage)
        return
      }

      setFiles((prev) => [...prev, ...validFiles])
      setError(null)
    },
    [files.length, maxFiles, maxSize, acceptedTypes, onUploadError],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
      }
    },
    [handleFiles],
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError(null)
    const newUploadedFiles: UploadedFile[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileName = `${Date.now()}-${file.name}`
        const filePath = path ? `${path}/${fileName}` : fileName

        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

        const result = await storageService.uploadFile(bucket, filePath, file, {
          contentType: file.type,
          upsert: false,
        })

        if (result.error) {
          throw new Error(result.error)
        }

        if (result.data) {
          const uploadedFile: UploadedFile = {
            id: fileName,
            name: file.name,
            size: file.size,
            type: file.type,
            url: result.data.publicUrl,
            path: result.data.path,
          }

          newUploadedFiles.push(uploadedFile)
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }))
        }
      }

      setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
      setFiles([])
      setUploadProgress({})
      onUploadComplete?.(newUploadedFiles)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed"
      setError(errorMessage)
      onUploadError?.(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (type === "application/pdf") return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Upload className="h-10 w-10 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to browse</p>
          <p className="text-sm text-gray-500 mb-4">
            Maximum {maxFiles} files, up to {maxSize}MB each
          </p>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={handleInputChange}
            className="hidden"
          />
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Files to upload:</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {uploadProgress[file.name] !== undefined && (
                  <div className="w-20">
                    <Progress value={uploadProgress[file.name]} className="h-2" />
                  </div>
                )}
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={uploading}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button onClick={uploadFiles} disabled={uploading || files.length === 0} className="w-full">
            {uploading ? "Uploading..." : `Upload ${files.length} file${files.length > 1 ? "s" : ""}`}
          </Button>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded files:</h3>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => window.open(file.url, "_blank")}>
                View
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
