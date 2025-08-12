import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search, MapPin, Stethoscope, Heart, Calendar, Users, Star, Shield } from "lucide-react"

export default function DiscoverPage() {
  const categories = [
    {
      title: "Veterinarians & Clinics",
      description: "Find trusted veterinary care near you",
      icon: Stethoscope,
      href: "/vets",
      count: "150+ providers",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Service Providers",
      description: "Groomers, trainers, walkers, and boarding",
      icon: Users,
      href: "/providers",
      count: "300+ services",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "NGOs & Rescues",
      description: "Animal rescue organizations and shelters",
      icon: Heart,
      href: "/ngos",
      count: "50+ organizations",
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Events & Drives",
      description: "Adoption events, vaccination drives, workshops",
      icon: Calendar,
      href: "/events",
      count: "25+ upcoming",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  const featuredProviders = [
    {
      name: "City Veterinary Hospital",
      type: "Veterinary Clinic",
      rating: 4.8,
      reviews: 124,
      location: "Downtown",
      verified: true,
    },
    {
      name: "Happy Paws Rescue",
      type: "Animal Rescue NGO",
      rating: 4.9,
      reviews: 89,
      location: "North District",
      verified: true,
    },
    {
      name: "Premium Pet Grooming",
      type: "Grooming Service",
      rating: 4.7,
      reviews: 156,
      location: "Central Mall",
      verified: true,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Discover Pet Care Near You</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Find trusted veterinarians, service providers, rescue organizations, and pet-friendly events in your area
        </p>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for vets, groomers, or services near you..."
              className="pl-12 pr-4 py-3 text-lg"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">Search</Button>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href={category.href}>
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm font-medium text-blue-600">{category.count}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Map Integration Placeholder */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Explore on Map</h2>
        <Card>
          <CardContent className="p-8">
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-600">Interactive Map Coming Soon</h3>
                  <p className="text-gray-500">View all providers and services on an interactive map</p>
                </div>
                <Button variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location Services
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Featured Providers */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Featured Providers</h2>
          <p className="text-muted-foreground">Highly rated and verified pet care professionals</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProviders.map((provider, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{provider.name}</CardTitle>
                  {provider.verified && <Shield className="w-5 h-5 text-blue-500" />}
                </div>
                <CardDescription>{provider.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= provider.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {provider.rating} ({provider.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {provider.location}
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Need Help Right Away?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button asChild size="lg" variant="outline">
              <Link href="/lost-found">
                <Heart className="w-4 h-4 mr-2" />
                Report Lost Pet
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/emergency">
                <Shield className="w-4 h-4 mr-2" />
                Emergency Services
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/adopt">
                <Users className="w-4 h-4 mr-2" />
                Adopt a Pet
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
