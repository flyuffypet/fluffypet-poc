"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, MapPin, Calendar, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface AdoptionDirectoryProps {
  pets: any[]
}

export function AdoptionDirectory({ pets }: AdoptionDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [speciesFilter, setSpeciesFilter] = useState("all")
  const [ageFilter, setAgeFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter
    const matchesAge =
      ageFilter === "all" ||
      (ageFilter === "young" && pet.age <= 2) ||
      (ageFilter === "adult" && pet.age > 2 && pet.age <= 7) ||
      (ageFilter === "senior" && pet.age > 7)
    const matchesSize = sizeFilter === "all" || pet.size === sizeFilter

    return matchesSearch && matchesSpecies && matchesAge && matchesSize
  })

  const getAgeCategory = (age: number) => {
    if (age <= 2) return "Young"
    if (age <= 7) return "Adult"
    return "Senior"
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
            <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Species" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Species</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
                <SelectItem value="bird">Birds</SelectItem>
                <SelectItem value="rabbit">Rabbits</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="young">Young (0-2 years)</SelectItem>
                <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                <SelectItem value="senior">Senior (8+ years)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="extra_large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredPets.length} pet{filteredPets.length !== 1 ? "s" : ""} available for adoption
        </p>
      </div>

      {/* Pet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => {
          const primaryImage = pet.pet_images?.find((img: any) => img.display_order === 0) || pet.pet_images?.[0]

          return (
            <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative">
                {primaryImage ? (
                  <Image
                    src={primaryImage.image_url || "/placeholder.svg"}
                    alt={primaryImage.alt_text || pet.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-6xl">🐾</div>
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90">
                    {pet.species}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {pet.age} year{pet.age !== 1 ? "s" : ""} • {getAgeCategory(pet.age)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {pet.organizations.name}
                    {pet.organizations.is_verified && (
                      <Badge variant="outline" className="text-xs ml-1">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {pet.good_with_kids && (
                      <Badge variant="outline" className="text-xs">
                        Good with kids
                      </Badge>
                    )}
                    {pet.good_with_pets && (
                      <Badge variant="outline" className="text-xs">
                        Good with pets
                      </Badge>
                    )}
                    {pet.special_needs && (
                      <Badge variant="outline" className="text-xs">
                        Special needs
                      </Badge>
                    )}
                  </div>

                  {pet.description && <p className="text-sm text-gray-600 line-clamp-2">{pet.description}</p>}

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-lg font-semibold">
                      {pet.adoption_fee ? `₹${pet.adoption_fee.toLocaleString()}` : "Free"}
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/adopt/${pet.id}`}>
                        <Heart className="w-4 h-4 mr-1" />
                        Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No pets found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  )
}
