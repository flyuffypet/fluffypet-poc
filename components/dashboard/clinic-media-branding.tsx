"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Upload, Camera, Edit } from "lucide-react"

export function ClinicMediaBranding() {
  const [activeTab, setActiveTab] = useState("cover")

  const mockMedia = [
    {
      id: 1,
      name: "Clinic Exterior",
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-15",
      size: "2.3 MB",
      category: "facility",
    },
    {
      id: 2,
      name: "Surgery Suite",
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-14",
      size: "1.8 MB",
      category: "facility",
    },
    {
      id: 3,
      name: "Team Photo",
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-12",
      size: "3.1 MB",
      category: "team",
    },
    {
      id: 4,
      name: "Happy Patient",
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-10",
      size: "1.5 MB",
      category: "patients",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "facility":
        return "default"
      case "team":
        return "secondary"
      case "patients":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Media & Branding
        </h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="cover">Cover & Logo</TabsTrigger>
          <TabsTrigger value="gallery">Media Gallery</TabsTrigger>
          <TabsTrigger value="branding">Branding Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="cover" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Clinic Cover"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Cover
                    </Button>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 1200x600px. This image will be displayed on your clinic profile.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Clinic Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=128&width=128"
                      alt="Clinic Logo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Change Logo
                    </Button>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 256x256px. Square format works best for profile pictures.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Branding Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <img src="/placeholder.svg?height=64&width=64" alt="Logo" className="w-16 h-16 rounded-full" />
                  <div>
                    <h3 className="text-lg font-semibold">Happy Paws Veterinary Clinic</h3>
                    <p className="text-muted-foreground">Comprehensive pet care since 2010</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default">Verified</Badge>
                      <Badge variant="secondary">4.8 ★</Badge>
                    </div>
                  </div>
                </div>
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Media</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMedia.length}</div>
                <p className="text-xs text-muted-foreground">Files uploaded</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.7 MB</div>
                <p className="text-xs text-muted-foreground">of 1 GB limit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Facility Photos</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMedia.filter((m) => m.category === "facility").length}</div>
                <p className="text-xs text-muted-foreground">Clinic images</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Photos</CardTitle>
                <Camera className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockMedia.filter((m) => m.category === "team").length}</div>
                <p className="text-xs text-muted-foreground">Staff images</p>
              </CardContent>
            </Card>
          </div>

          {/* Media Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockMedia.map((media) => (
                  <div key={media.id} className="border rounded-lg overflow-hidden">
                    <img src={media.url || "/placeholder.svg"} alt={media.name} className="w-full h-48 object-cover" />
                    <div className="p-3">
                      <h4 className="font-medium">{media.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant={getCategoryColor(media.category)}>{media.category}</Badge>
                        <span className="text-xs text-muted-foreground">{media.size}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(media.uploadDate).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Clinic Name</label>
                <Input defaultValue="Happy Paws Veterinary Clinic" />
              </div>

              <div>
                <label className="text-sm font-medium">Tagline</label>
                <Input defaultValue="Comprehensive pet care since 2010" />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Input defaultValue="We provide compassionate, high-quality veterinary care for your beloved pets." />
              </div>

              <div>
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                  <Input defaultValue="#2563eb" className="w-24" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded border"></div>
                  <Input defaultValue="#16a34a" className="w-24" />
                </div>
              </div>

              <Button>Save Branding Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
