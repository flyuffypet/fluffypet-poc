import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, Ruler, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PublicPetProfileProps {
  pet: {
    id: string
    name: string
    species: string
    breed: string
    age: number
    gender: string
    size: string
    description?: string
    pet_images?: Array<{
      image_url: string
      alt_text?: string
      display_order: number
    }>
    profiles: {
      id: string
      full_name: string
      avatar_url?: string
    }
  }
}

export function PublicPetProfile({ pet }: PublicPetProfileProps) {
  const primaryImage = pet.pet_images?.find((img) => img.display_order === 0) || pet.pet_images?.[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Meet {pet.name}!</h1>
          <p className="text-gray-600">Shared by {pet.profiles.full_name}</p>
        </div>

        {/* Pet Profile Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pet Image */}
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100">
                {primaryImage ? (
                  <Image
                    src={primaryImage.image_url || "/placeholder.svg"}
                    alt={primaryImage.alt_text || pet.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-8xl">🐾</div>
                  </div>
                )}
              </div>

              {/* Pet Details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{pet.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{pet.species}</Badge>
                    <Badge variant="outline">{pet.breed}</Badge>
                    <Badge variant="outline">{pet.gender}</Badge>
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Age</div>
                      <div className="text-sm text-gray-600">
                        {pet.age} year{pet.age !== 1 ? "s" : ""} old
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Ruler className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Size</div>
                      <div className="text-sm text-gray-600">{pet.size}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {pet.description && (
                  <div>
                    <h3 className="font-semibold mb-2">About {pet.name}</h3>
                    <p className="text-gray-700">{pet.description}</p>
                  </div>
                )}

                {/* Owner Info */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {pet.profiles.avatar_url ? (
                      <Image
                        src={pet.profiles.avatar_url || "/placeholder.svg"}
                        alt={pet.profiles.full_name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">Shared by</div>
                    <div className="text-sm text-gray-600">{pet.profiles.full_name}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Images */}
        {pet.pet_images && pet.pet_images.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>More Photos of {pet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pet.pet_images
                  .filter((img) => img.display_order !== 0)
                  .slice(0, 6)
                  .map((image, index) => (
                    <div key={index} className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.image_url || "/placeholder.svg"}
                        alt={image.alt_text || `${pet.name} photo ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Love pets like {pet.name}?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join FluffyPet to connect with pet owners, find trusted veterinarians, and discover amazing pets in your
            community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">
                <Heart className="w-4 h-4 mr-2" />
                Join FluffyPet
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/adopt">Browse Adoptable Pets</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
