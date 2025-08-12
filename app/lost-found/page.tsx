import { LostFoundHub } from "@/components/lost-found/lost-found-hub"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MapPin, Bell, Users } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function LostFoundPage() {
  // Mock data - in real app this would come from database
  const recentReports = [
    {
      id: "1",
      type: "lost",
      petName: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      location: "Central Park, NYC",
      lastSeen: "2024-01-15T14:30:00Z",
      image: "/placeholder.svg?height=200&width=200",
      description: "Friendly golden retriever, wearing blue collar",
      contactMasked: "Contact via FluffyPet",
    },
    {
      id: "2",
      type: "found",
      petName: "Unknown Cat",
      species: "Cat",
      breed: "Tabby",
      location: "Downtown District",
      lastSeen: "2024-01-14T09:15:00Z",
      image: "/placeholder.svg?height=200&width=200",
      description: "Gray tabby cat, very friendly, no collar",
      contactMasked: "Contact via FluffyPet",
    },
    {
      id: "3",
      type: "reunited",
      petName: "Luna",
      species: "Cat",
      breed: "Persian",
      location: "Residential Area",
      lastSeen: "2024-01-12T18:00:00Z",
      image: "/placeholder.svg?height=200&width=200",
      description: "White Persian cat - REUNITED with family!",
      contactMasked: "Success Story",
    },
  ]

  const stats = {
    totalReports: 1247,
    activeReports: 89,
    successfulReunions: 1158,
    communityMembers: 15420,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Lost & Found Pet Network</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Community-driven platform to help reunite lost pets with their families. Report, search, and get alerts
              for missing pets in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="/lost-found/new">Report Lost Pet</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Link href="/lost-found/map">View Map</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalReports.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.activeReports}</div>
              <div className="text-sm text-gray-600">Active Cases</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.successfulReunions.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Happy Reunions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.communityMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <LostFoundHub reports={recentReports} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/lost-found/new">Report Lost Pet</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/lost-found/map">
                    <MapPin className="w-4 h-4 mr-2" />
                    View Map
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/lost-found/subscribe">
                    <Bell className="w-4 h-4 mr-2" />
                    Get Alerts
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Report</h4>
                    <p className="text-xs text-gray-600">Post details about your lost or found pet</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Search</h4>
                    <p className="text-xs text-gray-600">Browse reports and get location-based alerts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Connect</h4>
                    <p className="text-xs text-gray-600">Contact through our secure messaging system</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-orange-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Reunite</h4>
                    <p className="text-xs text-gray-600">Celebrate happy reunions with the community</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Community Support
                </CardTitle>
                <CardDescription>Join our network of pet lovers helping reunite families</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/community">Join Community</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Lost & Found Pets - FluffyPet",
  description:
    "Community-driven platform to help reunite lost pets with their families. Report missing pets, search found animals, and get location-based alerts.",
}
