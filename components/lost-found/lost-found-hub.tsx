"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Calendar, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Report {
  id: string
  type: "lost" | "found" | "reunited"
  petName: string
  species: string
  breed: string
  location: string
  lastSeen: string
  image: string
  description: string
  contactMasked: string
}

interface LostFoundHubProps {
  reports: Report[]
}

export function LostFoundHub({ reports }: LostFoundHubProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lost":
        return "bg-red-100 text-red-800"
      case "found":
        return "bg-blue-100 text-blue-800"
      case "reunited":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "lost":
        return "Lost"
      case "found":
        return "Found"
      case "reunited":
        return "Reunited"
      default:
        return type
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  const filterReports = (type?: string) => {
    return reports.filter((report) => {
      const matchesType = !type || report.type === type
      const matchesSearch =
        report.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSpecies = selectedSpecies === "all" || report.species.toLowerCase() === selectedSpecies
      const matchesLocation =
        selectedLocation === "all" || report.location.toLowerCase().includes(selectedLocation.toLowerCase())

      return matchesType && matchesSearch && matchesSpecies && matchesLocation
    })
  }

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={report.image || "/placeholder.svg"} alt={report.petName} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{report.petName}</h3>
                <p className="text-sm text-gray-600">
                  {report.breed} • {report.species}
                </p>
              </div>
              <Badge className={getTypeColor(report.type)}>{getTypeLabel(report.type)}</Badge>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{report.location}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Last seen {formatTimeAgo(report.lastSeen)}</span>
              </div>
            </div>

            <p className="text-sm text-gray-700 line-clamp-2 mb-3">{report.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{report.contactMasked}</span>
              <Button asChild size="sm">
                <Link href={`/lost-found/${report.id}`}>View Details</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, breed, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
            <SelectTrigger>
              <SelectValue placeholder="All species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All species</SelectItem>
              <SelectItem value="dog">Dogs</SelectItem>
              <SelectItem value="cat">Cats</SelectItem>
              <SelectItem value="bird">Birds</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              <SelectItem value="central">Central Area</SelectItem>
              <SelectItem value="downtown">Downtown</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="lost">Lost ({reports.filter((r) => r.type === "lost").length})</TabsTrigger>
          <TabsTrigger value="found">Found ({reports.filter((r) => r.type === "found").length})</TabsTrigger>
          <TabsTrigger value="reunited">Reunited ({reports.filter((r) => r.type === "reunited").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filterReports().map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lost" className="space-y-4">
          <div className="space-y-4">
            {filterReports("lost").map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="found" className="space-y-4">
          <div className="space-y-4">
            {filterReports("found").map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reunited" className="space-y-4">
          <div className="space-y-4">
            {filterReports("reunited").map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
          {filterReports("reunited").length > 0 && (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">Success Stories</h3>
              <p className="text-gray-600">These happy reunions inspire our community to keep helping!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Load More */}
      <div className="text-center py-6">
        <Button variant="outline" size="lg">
          Load More Reports
        </Button>
      </div>
    </div>
  )
}
