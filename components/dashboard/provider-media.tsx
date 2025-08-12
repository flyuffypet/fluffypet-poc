"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Upload, ImageIcon, Video, FileText, Search, Grid, List } from "lucide-react"

export function ProviderMedia() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")

  const mockMedia = [
    {
      id: 1,
      name: "Before_After_Grooming_Buddy.jpg",
      type: "image",
      size: "2.4 MB",
      uploadDate: "2024-01-10",
      tags: ["grooming", "before-after", "dog"],
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 2,
      name: "Training_Session_Luna.mp4",
      type: "video",
      size: "15.8 MB",
      uploadDate: "2024-01-09",
      tags: ["training", "video", "progress"],
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 3,
      name: "Health_Certificate_Max.pdf",
      type: "document",
      size: "1.2 MB",
      uploadDate: "2024-01-08",
      tags: ["certificate", "health", "document"],
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 4,
      name: "Walking_Route_Charlie.jpg",
      type: "image",
      size: "3.1 MB",
      uploadDate: "2024-01-07",
      tags: ["walking", "route", "exercise"],
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 5,
      name: "Portfolio_Showcase.jpg",
      type: "image",
      size: "4.2 MB",
      uploadDate: "2024-01-06",
      tags: ["portfolio", "showcase", "professional"],
      url: "/placeholder.svg?height=200&width=200",
    },
    {
      id: 6,
      name: "Client_Testimonial_Video.mp4",
      type: "video",
      size: "22.5 MB",
      uploadDate: "2024-01-05",
      tags: ["testimonial", "client", "review"],
      url: "/placeholder.svg?height=200&width=200",
    },
  ]

  const filteredMedia = mockMedia.filter(
    (media) =>
      media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "document":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getMediaTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "bg-blue-100 text-blue-800"
      case "video":
        return "bg-purple-100 text-purple-800"
      case "document":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Portfolio
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px] pl-8"
            />
          </div>
          <div className="flex border rounded-lg">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Media Files</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your images, videos, or documents here, or click to browse
            </p>
            <Button>Choose Files</Button>
            <p className="text-xs text-muted-foreground mt-2">Supported formats: JPG, PNG, MP4, PDF (Max 50MB)</p>
          </div>
        </CardContent>
      </Card>

      {/* Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedia.length}</div>
            <p className="text-xs text-muted-foreground">Across all types</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedia.filter((m) => m.type === "image").length}</div>
            <p className="text-xs text-muted-foreground">Photos & graphics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedia.filter((m) => m.type === "video").length}</div>
            <p className="text-xs text-muted-foreground">Training & demos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMedia.filter((m) => m.type === "document").length}</div>
            <p className="text-xs text-muted-foreground">Certificates & forms</p>
          </CardContent>
        </Card>
      </div>

      {/* Media Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map((media) => (
            <Card key={media.id} className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <img src={media.url || "/placeholder.svg"} alt={media.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm truncate flex-1">{media.name}</h4>
                  <Badge className={`ml-2 ${getMediaTypeColor(media.type)}`}>
                    {getMediaIcon(media.type)}
                    <span className="ml-1">{media.type}</span>
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {media.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{media.size}</span>
                  <span>{new Date(media.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredMedia.map((media) => (
                <div key={media.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      {getMediaIcon(media.type)}
                    </div>
                    <div>
                      <p className="font-medium">{media.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getMediaTypeColor(media.type)}>{media.type}</Badge>
                        <span className="text-xs text-muted-foreground">{media.size}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(media.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {media.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Delete
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
