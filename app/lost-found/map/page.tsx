import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Layers, Filter } from "lucide-react"
import Link from "next/link"

export default function LostFoundMapPage() {
  // Mock data for map markers
  const mapReports = [
    { id: "1", type: "lost", lat: 40.7829, lng: -73.9654, petName: "Buddy", species: "Dog" },
    { id: "2", type: "found", lat: 40.7589, lng: -73.9851, petName: "Unknown Cat", species: "Cat" },
    { id: "3", type: "reunited", lat: 40.7505, lng: -73.9934, petName: "Luna", species: "Cat" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lost-found">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lost & Found Map</h1>
              <p className="text-gray-600">Interactive map showing all reported lost and found pets in your area</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Layers className="w-4 h-4 mr-2" />
                Layers
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="bg-gray-200 rounded-lg h-[600px] flex items-center justify-center relative overflow-hidden">
                  {/* Map Placeholder */}
                  <div className="text-center space-y-4">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-600">Interactive Map</h3>
                      <p className="text-gray-500">Google Maps integration will show clustered markers here</p>
                    </div>
                  </div>

                  {/* Mock Map Markers */}
                  <div className="absolute top-20 left-32 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-xs text-white font-bold">L</span>
                  </div>
                  <div className="absolute top-40 right-40 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-xs text-white font-bold">F</span>
                  </div>
                  <div className="absolute bottom-32 left-1/2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                    <span className="text-xs text-white font-bold">R</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Lost Pets</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Found Pets</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Reunited</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Reports</CardTitle>
                <CardDescription>Latest lost and found reports in this area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mapReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        report.type === "lost" ? "bg-red-500" : report.type === "found" ? "bg-blue-500" : "bg-green-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{report.petName}</h4>
                      <p className="text-xs text-gray-500">{report.species}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        report.type === "lost"
                          ? "border-red-200 text-red-700"
                          : report.type === "found"
                            ? "border-blue-200 text-blue-700"
                            : "border-green-200 text-green-700"
                      }
                    >
                      {report.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Map Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Map Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MapPin className="w-4 h-4 mr-2" />
                  Center on My Location
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter by Date Range
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Layers className="w-4 h-4 mr-2" />
                  Toggle Heatmap
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/lost-found/new">Report Lost Pet</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/lost-found/subscribe">Get Location Alerts</Link>
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
  title: "Lost & Found Map - FluffyPet",
  description: "Interactive map showing all reported lost and found pets in your area with clustered markers.",
}
