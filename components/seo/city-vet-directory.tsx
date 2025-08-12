"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Globe, Star, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CityVetDirectoryProps {
  city: {
    slug: string
    name: string
    state: string
  }
  vets: any[]
}

export function CityVetDirectory({ city, vets }: CityVetDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredVets = vets.filter(
    (vet) =>
      vet.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.organizations.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vet.organizations.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search */}
      <div className="mb-8">
        <Input
          placeholder={`Search veterinarians in ${city.name}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredVets.length} veterinarian{filteredVets.length !== 1 ? "s" : ""} found in {city.name}
        </p>
      </div>

      {/* Vet Listings */}
      <div className="space-y-6">
        {filteredVets.map((vet) => {
          const organization = vet.organizations

          return (
            <Card key={vet.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                    {vet.avatar_url ? (
                      <Image
                        src={vet.avatar_url || "/placeholder.svg"}
                        alt={vet.full_name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-2xl">👨‍⚕️</div>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold">{vet.full_name}</h3>
                        <p className="text-lg text-gray-700">{organization.name}</p>
                        {organization.is_verified && (
                          <Badge variant="outline" className="mt-1">
                            Verified Clinic
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">4.8</span>
                        <span className="text-gray-500">(124 reviews)</span>
                      </div>
                    </div>

                    {vet.bio && <p className="text-gray-600 mb-4 line-clamp-2">{vet.bio}</p>}

                    {organization.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{organization.description}</p>
                    )}

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      {organization.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{organization.address}</span>
                        </div>
                      )}
                      {organization.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{organization.phone}</span>
                        </div>
                      )}
                      {organization.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Services */}
                    {organization.services && organization.services.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {organization.services.slice(0, 3).map((service: any) => (
                            <Badge key={service.id} variant="outline" className="text-xs">
                              {service.name}
                            </Badge>
                          ))}
                          {organization.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{organization.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button asChild>
                        <Link href={`/vets/${organization.id}`}>
                          <Clock className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/vets/${organization.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredVets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No veterinarians found</h3>
          <p className="text-gray-600">Try adjusting your search or browse all veterinarians.</p>
          <Button asChild className="mt-4">
            <Link href="/vets">Browse All Vets</Link>
          </Button>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-12 bg-white rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Veterinary Care in {city.name}</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            {city.name} is home to many excellent veterinary clinics and animal hospitals providing comprehensive pet
            care services. Whether you need routine check-ups, emergency care, or specialized treatments, you can find
            qualified veterinarians in {city.name} through FluffyPet.
          </p>
          <p className="text-gray-700 mb-4">
            Our platform connects pet owners with verified veterinary professionals in {city.name}, {city.state}. All
            listed veterinarians are licensed and committed to providing the highest quality care for your pets.
          </p>
          <p className="text-gray-700">
            Book appointments online, read reviews from other pet owners, and find the right veterinary care for your
            furry family members in {city.name}.
          </p>
        </div>
      </div>
    </div>
  )
}
