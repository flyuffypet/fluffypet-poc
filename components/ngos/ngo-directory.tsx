"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Shield, Heart, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface NGO {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  organizations: {
    id: string
    name: string
    org_type: string
    description?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    is_verified: boolean
    created_at: string
  }
}

interface NGODirectoryProps {
  ngos: NGO[]
}

export function NGODirectory({ ngos }: NGODirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFocus, setSelectedFocus] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const focusAreas = ["Dog Rescue", "Cat Rescue", "Wildlife", "Farm Animals", "All Animals", "Rehabilitation"]

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.organizations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.organizations.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFocus =
      selectedFocus === "all" || ngo.organizations.description?.toLowerCase().includes(selectedFocus.toLowerCase())

    const matchesLocation =
      selectedLocation === "all" || ngo.organizations.address?.toLowerCase().includes(selectedLocation.toLowerCase())

    return matchesSearch && matchesFocus && matchesLocation
  })

  const locations = Array.from(
    new Set(ngos.map((n) => n.organizations.address?.split(",").pop()?.trim()).filter(Boolean)),
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search NGOs and rescues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedFocus} onValueChange={setSelectedFocus}>
            <SelectTrigger>
              <SelectValue placeholder="All focus areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All focus areas</SelectItem>
              {focusAreas.map((focus) => (
                <SelectItem key={focus} value={focus.toLowerCase()}>
                  {focus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location!}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredNGOs.length} of {ngos.length} organizations
        </p>
      </div>

      {/* NGO Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNGOs.map((ngo) => (
          <Card key={ngo.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={ngo.avatar_url || "/placeholder.svg"} alt={ngo.organizations.name} />
                  <AvatarFallback>
                    {ngo.organizations.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg leading-tight">{ngo.organizations.name}</h3>
                    {ngo.organizations.is_verified && <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
                    <Heart className="w-4 h-4" />
                    <span>Animal Rescue NGO</span>
                  </div>
                </div>
              </div>

              {ngo.organizations.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{ngo.organizations.description}</p>
              )}

              {ngo.organizations.address && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{ngo.organizations.address}</span>
                </div>
              )}

              <div className="space-y-2 mb-4">
                {ngo.organizations.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    <span>{ngo.organizations.phone}</span>
                  </div>
                )}
                {ngo.organizations.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{ngo.organizations.email}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/ngos/${ngo.organizations.name.toLowerCase().replace(/\s+/g, "-")}`}>View Profile</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNGOs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No organizations found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedFocus("all")
              setSelectedLocation("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
