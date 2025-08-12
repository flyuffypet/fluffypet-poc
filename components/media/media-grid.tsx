"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2, FileText, ImageIcon } from "lucide-react"

type MediaRow = {
  id: string
  pet_id: string
  type: string
  filename?: string | null
  path: string
  url?: string | null
  mime_type?: string | null
  size?: number | null
  created_at: string
}

interface MediaGridProps {
  petId: string
  onMediaDeleted?: () => void
  bucket?: string
}

export default function MediaGrid({ petId, onMediaDeleted, bucket = "pet-media" }: MediaGridProps) {
  const supabase = createClient()
  const [items, setItems] = useState<MediaRow[]>([])
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMedia()
  }, [petId])

  const loadMedia = async () => {
    try {
      const { data, error } = await supabase
        .from("pet_media")
        .select("*")
        .eq("pet_id", petId)
        .order("created_at", { ascending: false })
        .limit(60)

      if (error) throw error

      setItems(data || [])

      // Generate signed URLs for private media
      const urls: Record<string, string> = {}

      for (const item of data || []) {
        try {
          // For private buckets, create signed URLs
          const { data: signedUrlData, error: urlError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(item.path, 3600) // 1 hour expiry

          if (!urlError && signedUrlData) {
            urls[item.id] = signedUrlData.signedUrl
          } else if (item.url) {
            // Fallback to stored public URL if available
            urls[item.id] = item.url
          }
        } catch (error) {
          console.warn(`Failed to generate signed URL for ${item.path}:`, error)
        }
      }
      setSignedUrls(urls)
    } catch (error) {
      console.error("Error loading media:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMedia = async (mediaId: string, path: string) => {
    try {
      // Delete file from Supabase Storage
      const { error: storageError } = await supabase.storage.from(bucket).remove([path])

      if (storageError) {
        console.warn("Storage deletion error:", storageError)
        // Continue with database deletion even if storage fails
      }

      // Delete database record
      const { error: dbError } = await supabase.from("pet_media").delete().eq("id", mediaId)
      if (dbError) throw dbError

      // Update local state
      setItems((prev) => prev.filter((item) => item.id !== mediaId))
      setSignedUrls((prev) => {
        const updated = { ...prev }
        delete updated[mediaId]
        return updated
      })

      onMediaDeleted?.()
    } catch (error: any) {
      console.error("Delete error:", error)
      alert(`Failed to delete media: ${error.message}`)
    }
  }

  const downloadMedia = async (item: MediaRow) => {
    try {
      const url = signedUrls[item.id]
      if (!url) {
        throw new Error("No download URL available")
      }

      const response = await fetch(url)
      const blob = await response.blob()

      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = item.filename || `download.${item.path.split(".").pop()}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download file")
    }
  }

  const openMedia = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">No media files yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Upload photos and documents to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const signedUrl = signedUrls[item.id]
        const isImage = item.type === "image" || item.mime_type?.startsWith("image/")

        return (
          <div
            key={item.id}
            className="group relative border rounded-lg overflow-hidden bg-muted hover:shadow-md transition-shadow"
          >
            <div className="aspect-square flex items-center justify-center">
              {isImage && signedUrl ? (
                <Image
                  src={signedUrl || "/placeholder.svg"}
                  alt={item.filename || "Media"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  onError={(e) => {
                    // Fallback to document icon if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-xs text-muted-foreground truncate w-full max-w-full">
                    {item.filename || "Document"}
                  </div>
                  {item.mime_type && (
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {item.mime_type.split("/")[1]?.toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {signedUrl && (
                <>
                  <Button size="sm" variant="secondary" onClick={() => openMedia(signedUrl)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => downloadMedia(item)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button size="sm" variant="destructive" onClick={() => deleteMedia(item.id, item.path)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* File info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent text-white p-2">
              <div className="text-xs truncate">{item.filename || item.path.split("/").pop()}</div>
              <div className="flex justify-between items-center mt-1">
                {item.size && <div className="text-xs text-gray-300">{(item.size / 1024 / 1024).toFixed(2)} MB</div>}
                <div className="text-xs text-gray-300">{new Date(item.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
