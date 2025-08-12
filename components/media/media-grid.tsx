"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { edgeFunctions } from "@/lib/edge-functions"
import { Button } from "@/components/ui/button"
import { Download, Eye, Trash2 } from "lucide-react"

type MediaRow = {
  id: string
  pet_id: string
  type: string
  filename?: string | null
  path: string
  mime_type?: string | null
  size?: number | null
  created_at: string
}

interface MediaGridProps {
  petId: string
  onMediaDeleted?: () => void
}

export default function MediaGrid({ petId, onMediaDeleted }: MediaGridProps) {
  const supabase = getSupabaseBrowserClient()
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

      // Generate signed URLs for all media
      const urls: Record<string, string> = {}
      for (const item of data || []) {
        try {
          const { signedUrl } = await edgeFunctions.createSignedUrl(item.path, "media", 3600)
          urls[item.id] = signedUrl
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
      await edgeFunctions.deleteMedia(mediaId, path, "media")

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

  const downloadMedia = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading media...</div>
  }

  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">No media files yet.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => {
        const signedUrl = signedUrls[item.id]
        const isImage = item.type === "image" || item.mime_type?.startsWith("image/")

        return (
          <div key={item.id} className="group relative border rounded-lg overflow-hidden bg-muted">
            <div className="aspect-square flex items-center justify-center">
              {isImage && signedUrl ? (
                <Image
                  src={signedUrl || "/placeholder.svg"}
                  alt={item.filename || "Media"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <Eye className="h-8 w-8 text-muted-foreground mb-2" />
                  <div className="text-xs text-muted-foreground truncate w-full">{item.filename || "Document"}</div>
                </div>
              )}
            </div>

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {signedUrl && (
                <>
                  <Button size="sm" variant="secondary" onClick={() => window.open(signedUrl, "_blank")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadMedia(signedUrl, item.filename || "download")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button size="sm" variant="destructive" onClick={() => deleteMedia(item.id, item.path)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* File info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-2">
              <div className="text-xs truncate">{item.filename || item.path.split("/").pop()}</div>
              {item.size && <div className="text-xs text-gray-300">{(item.size / 1024 / 1024).toFixed(2)} MB</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
