"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Shield, Phone, Star } from "lucide-react"
import Link from "next/link"

interface Vet {
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
    hours?: any
    is_verified: boolean
    created_at: string
  }
  services?: Array<{
    id: string
    name: string
    description?: string
    price_min?: number
    price_max?: number
    is_active: boolean
  }>
}

interface VetDirectoryProps {
  vets: Vet[]
}

export function VetDirectory({ vets }: VetDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const specialties = ["General Practice", "Surgery", "Dentistry", "Emergency", "Exotic Animals", "Dermatology"]

  const filteredVets = vets.filter((vet) => {
    const matchesSearch =
      vet.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.organizations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.organizations.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty =
      selectedSpecialty === "all" ||
      vet.services?.some((service) => service.name.toLowerCase().includes(selectedSpecialty.toLowerCase()))

    const matchesLocation =
      selectedLocation === "all" || vet.organizations.address?.toLowerCase().includes(selectedLocation.toLowerCase())

    return matchesSearch && matchesSpecialty && matchesLocation
  })

  const locations = Array.from(
    new Set(vets.map((v) => v.organizations.address?.split(",").pop()?.trim()).filter(Boolean)),
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search veterinarians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="All specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialties</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty.toLowerCase()}>
                  {specialty}
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
          Showing {filteredVets.length} of {vets.length} veterinarians
        </p>
      </div>

      {/* Vet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVets.map((vet) => (
          <Card key={vet.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={vet.avatar_url || "/placeholder.svg"} alt={vet.full_name} />
                  <AvatarFallback>
                    {vet.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{vet.full_name}</h3>
                    {vet.organizations.is_verified && <Shield className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-gray-600 font-medium">{vet.organizations.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (124 reviews)</span>
                  </div>
                </div>
              </div>

              {vet.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-2">{vet.bio}</p>}

              {vet.organizations.address && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{vet.organizations.address}</span>
                </div>
              )}

              {vet.organizations.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Phone className="w-4 h-4" />
                  <span>{vet.organizations.phone}</span>
                </div>
              )}

              {vet.services && vet.services.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {vet.services.slice(0, 3).map((service) => (
                      <Badge key={service.id} variant="secondary" className="text-xs">
                        {service.name}
                      </Badge>
                    ))}
                    {vet.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vet.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/vets/${vet.organizations.name.toLowerCase().replace(/\s+/g, "-")}`}>View Profile</Link>
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No veterinarians found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedSpecialty("all")
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
