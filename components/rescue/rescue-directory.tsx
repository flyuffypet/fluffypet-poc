"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Heart, MapPin, Calendar, Shield } from "lucide-react"
import Link from "next/link"

interface RescueDirectoryProps {
  rescueCases: any[]
}

export function RescueDirectory({ rescueCases }: RescueDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredCases = rescueCases.filter((case_) => {
    const matchesSearch =
      case_.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.location_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.species.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    const matchesPriority = priorityFilter === "all" || case_.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "default"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "secondary"
      case "in_progress":
        return "default"
      case "rescued":
        return "default"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "urgent") return <AlertTriangle className="w-4 h-4" />
    return <Heart className="w-4 h-4" />
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search by case number, location, or species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="rescued">Rescued</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredCases.length} active rescue case{filteredCases.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((case_) => (
          <Card key={case_.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Case #{case_.case_number}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(case_.priority)} className="text-xs">
                    {getPriorityIcon(case_.priority)}
                    <span className="ml-1">{case_.priority}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {case_.location_area}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(case_.created_at).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Species:</span>
                  <Badge variant="outline" className="text-xs">
                    {case_.species}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Status:</span>
                  <Badge variant={getStatusColor(case_.status)} className="text-xs">
                    {case_.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {case_.description_public && (
                <p className="text-sm text-gray-600 line-clamp-3">{case_.description_public}</p>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {case_.organizations.name}
                    {case_.organizations.is_verified && (
                      <Badge variant="outline" className="text-xs ml-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {case_.estimated_cost && (
                  <div className="text-sm font-medium">Est. ₹{case_.estimated_cost.toLocaleString()}</div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Heart className="w-4 h-4 mr-1" />
                  Support
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No rescue cases found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Support Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Support Rescue Operations</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Every rescue operation requires resources, volunteers, and community support. Join our mission to save lives
          and provide second chances.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/volunteer">Become a Volunteer</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/donate">Make a Donation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
