"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, FileText, Download, Trash2 } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

interface MediaGridProps {
  petId: string
  onDelete?: (id: string) => void
}

export default function MediaGrid({ petId, onDelete }: MediaGridProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading media
    const loadMedia = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockMedia: MediaItem[] = [
        {
          id: "1",
          name: "vaccination-record.pdf",
          url: "/placeholder.svg",
          type: "application/pdf",
          size: 1024 * 1024,
          uploadedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "pet-photo.jpg",
          url: "/placeholder.jpg",
          type: "image/jpeg",
          size: 2 * 1024 * 1024,
          uploadedAt: new Date().toISOString(),
        },
      ]

      setMedia(mockMedia)
      setLoading(false)
    }

    loadMedia()
  }, [petId])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setMedia((prev) => prev.filter((item) => item.id !== id))
      onDelete?.(id)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />
    }
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No media files</h3>
        <p className="text-gray-500">Upload some photos or documents to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {media.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {item.type.startsWith("image/") ? (
                <img src={item.url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                getFileIcon(item.type)
              )}
            </div>
            <div className="p-4">
              <h4 className="font-medium text-sm truncate mb-1">{item.name}</h4>
              <p className="text-xs text-gray-500 mb-3">
                {formatFileSize(item.size)} • {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
