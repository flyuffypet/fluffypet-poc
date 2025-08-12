import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Clock, Ruler, MapPin, AlertTriangle, Sparkles } from "lucide-react"
import Link from "next/link"

interface BreedGuideProps {
  breed: {
    name: string
    species: string
    origin: string
    lifespan: string
    size: string
    temperament: string[]
    commonIssues: string[]
    careRequirements: {
      exercise: string
      grooming: string
      training: string
    }
    description: string
  }
  slug: string
}

export function BreedGuide({ breed, slug }: BreedGuideProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{breed.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{breed.description}</p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href={`/adopt?breed=${slug}`}>
                  <Heart className="w-4 h-4 mr-2" />
                  Find {breed.name}s for Adoption
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/vets">Find a Veterinarian</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Facts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Facts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="font-medium">Origin</div>
                <div className="text-sm text-gray-600">{breed.origin}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Lifespan</div>
                <div className="text-sm text-gray-600">{breed.lifespan}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Ruler className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="font-medium">Size</div>
                <div className="text-sm text-gray-600">{breed.size}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="font-medium">Species</div>
                <div className="text-sm text-gray-600">{breed.species}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperament */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Temperament & Personality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {breed.temperament.map((trait) => (
                <Badge key={trait} variant="outline" className="text-sm">
                  {trait}
                </Badge>
              ))}
            </div>
            <p className="text-gray-700">
              {breed.name}s are known for being {breed.temperament.join(", ").toLowerCase()}. These traits make them
              excellent companions for the right family.
            </p>
          </CardContent>
        </Card>

        {/* Care Requirements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Care Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Exercise Needs</h3>
              <p className="text-gray-700">{breed.careRequirements.exercise}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Grooming Requirements</h3>
              <p className="text-gray-700">{breed.careRequirements.grooming}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Training</h3>
              <p className="text-gray-700">{breed.careRequirements.training}</p>
            </div>
          </CardContent>
        </Card>

        {/* Health Considerations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Common Health Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breed.commonIssues.map((issue) => (
                <div key={issue} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-900">{issue}</h4>
                    <p className="text-sm text-orange-700">
                      Regular veterinary check-ups can help detect and manage this condition early.
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Important:</strong> This information is for educational purposes only. Always consult with a
                qualified veterinarian for specific health concerns about your pet.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Find Services */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Find {breed.name} Services</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Connect with veterinarians, groomers, and trainers who have experience with {breed.name}s in your area.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/vets">Find Veterinarians</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/providers">Find Groomers & Trainers</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
