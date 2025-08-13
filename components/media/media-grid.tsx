"use client"

import { useState } from "react"
import { FileImage, Download, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface MediaItem {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: string
  tags?: string[]
}

interface MediaGridProps {
  items: MediaItem[]
  onDelete?: (id: string) => void
  onDownload?: (item: MediaItem) => void
  className?: string
}

export function MediaGrid({ items, onDelete, onDownload, className }: MediaGridProps) {
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isImage = (type: string) => type.startsWith("image/")

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted flex items-center justify-center relative group">
              {isImage(item.type) ? (
                <img src={item.url || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <FileImage className="h-16 w-16 text-muted-foreground" />
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedItem(item)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{item.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      {isImage(item.type) ? (
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-auto max-h-[70vh] object-contain"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-64 bg-muted rounded">
                          <FileImage className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {onDownload && (
                  <Button variant="secondary" size="sm" onClick={() => onDownload(item)}>
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-medium text-sm truncate mb-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {formatFileSize(item.size)} • {new Date(item.uploadedAt).toLocaleDateString()}
              </p>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{item.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
