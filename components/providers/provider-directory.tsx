"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Shield } from "lucide-react"
import Link from "next/link"

interface Provider {
  id: string
  full_name: string
  avatar_url?: string
  organizations: {
    id: string
    name: string
    org_type: string
    description?: string
    address?: string
    is_verified: boolean
    created_at: string
  }
}

interface ProviderDirectoryProps {
  providers: Provider[]
}

export function ProviderDirectory({ providers }: ProviderDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const getOrgTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      clinic: "Veterinary Clinic",
      ngo: "Animal Rescue NGO",
      breeder: "Professional Breeder",
      hostel: "Pet Boarding Facility",
      solo_provider: "Independent Provider",
    }
    return labels[type] || type
  }

  const getOrgTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      clinic: "bg-blue-100 text-blue-800",
      ngo: "bg-green-100 text-green-800",
      breeder: "bg-purple-100 text-purple-800",
      hostel: "bg-orange-100 text-orange-800",
      solo_provider: "bg-gray-100 text-gray-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.organizations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.organizations.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || provider.organizations.org_type === selectedType

    const matchesLocation =
      selectedLocation === "all" ||
      provider.organizations.address?.toLowerCase().includes(selectedLocation.toLowerCase())

    return matchesSearch && matchesType && matchesLocation
  })

  const orgTypes = Array.from(new Set(providers.map((p) => p.organizations.org_type)))
  const locations = Array.from(
    new Set(providers.map((p) => p.organizations.address?.split(",").pop()?.trim()).filter(Boolean)),
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="All provider types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All provider types</SelectItem>
              {orgTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getOrgTypeLabel(type)}
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
          Showing {filteredProviders.length} of {providers.length} providers
        </p>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={provider.avatar_url || "/placeholder.svg"} alt={provider.full_name} />
                  <AvatarFallback>
                    {provider.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{provider.full_name}</h3>
                    {provider.organizations.is_verified && <Shield className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{provider.organizations.name}</p>
                </div>
              </div>

              <Badge className={`mb-3 ${getOrgTypeColor(provider.organizations.org_type)}`}>
                {getOrgTypeLabel(provider.organizations.org_type)}
              </Badge>

              {provider.organizations.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{provider.organizations.description}</p>
              )}

              {provider.organizations.address && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{provider.organizations.address}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/providers/${provider.id}`}>View Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No providers found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedType("all")
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
