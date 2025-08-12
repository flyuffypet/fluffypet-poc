"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Search, Users, Clock, Heart, Stethoscope, GraduationCap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  type: string
  image: string
  attendees: number
  maxAttendees: number
}

interface EventsDirectoryProps {
  events: Event[]
}

export function EventsDirectory({ events }: EventsDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDate, setSelectedDate] = useState("all")

  const eventTypes = [
    { value: "adoption", label: "Adoption Drives", icon: Heart },
    { value: "medical", label: "Medical Camps", icon: Stethoscope },
    { value: "education", label: "Workshops", icon: GraduationCap },
  ]

  const getEventTypeIcon = (type: string) => {
    const eventType = eventTypes.find((t) => t.value === type)
    return eventType?.icon || Calendar
  }

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      adoption: "bg-red-100 text-red-800",
      medical: "bg-blue-100 text-blue-800",
      education: "bg-green-100 text-green-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || event.type === selectedType

    const matchesDate =
      selectedDate === "all" ||
      (selectedDate === "upcoming" && new Date(event.date) >= new Date()) ||
      (selectedDate === "this-week" && new Date(event.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesType && matchesDate
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="All event types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger>
              <SelectValue placeholder="All dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All dates</SelectItem>
              <SelectItem value="upcoming">Upcoming events</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const EventIcon = getEventTypeIcon(event.type)
          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-48">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                <div className="absolute top-4 left-4">
                  <Badge className={getEventTypeColor(event.type)}>
                    <EventIcon className="w-3 h-3 mr-1" />
                    {eventTypes.find((t) => t.value === event.type)?.label || event.type}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attending
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500 mb-3">Organized by {event.organizer}</p>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.id}`}>View Details & RSVP</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No events found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedType("all")
              setSelectedDate("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
