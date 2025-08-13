"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload, File, ImageIcon, Video } from "lucide-react"
import { storageService } from "@/lib/storage"

interface UploadedFile {
  id: string
  name: string
  url: string
  path: string
  type: string
  size: number
}

interface MediaUploaderProps {
  onUpload?: (files: UploadedFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  bucket?: string
  folder?: string
}

export function MediaUploader({
  onUpload,
  maxFiles = 10,
  acceptedTypes = ["image/*", "video/*", "application/pdf"],
  bucket = "pet-media",
  folder = "uploads",
}: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      setUploading(true)
      setUploadProgress(0)

      const uploadPromises = acceptedFiles.map(async (file, index) => {
        try {
          const result = await storageService.uploadFile(file, bucket, folder)

          if (result.error) {
            throw new Error(result.error)
          }

          const uploadedFile: UploadedFile = {
            id: Math.random().toString(36).substring(2),
            name: file.name,
            url: result.url,
            path: result.path,
            type: file.type,
            size: file.size,
          }

          // Update progress
          setUploadProgress(((index + 1) / acceptedFiles.length) * 100)

          return uploadedFile
        } catch (error) {
          console.error("Upload failed:", error)
          return null
        }
      })

      const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean) as UploadedFile[]

      setFiles((prev) => [...prev, ...uploadedFiles])
      setUploading(false)
      setUploadProgress(0)

      if (onUpload) {
        onUpload(uploadedFiles)
      }
    },
    [files.length, maxFiles, bucket, folder, onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - files.length,
  })

  const removeFile = async (fileToRemove: UploadedFile) => {
    try {
      await storageService.deleteFile(fileToRemove.path, bucket)
      setFiles((prev) => prev.filter((file) => file.id !== fileToRemove.id))
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />
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
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-gray-500">
                  Maximum {maxFiles} files. Accepted: {acceptedTypes.join(", ")}
                </p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Uploaded Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
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
