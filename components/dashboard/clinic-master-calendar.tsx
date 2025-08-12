"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Calendar, Users, MapPin, Settings, ChevronLeft, ChevronRight } from "lucide-react"

export function ClinicMasterCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("day")

  const mockResources = [
    { id: 1, name: "Dr. Smith", type: "vet", capacity: 8, booked: 6, color: "bg-blue-500" },
    { id: 2, name: "Dr. Johnson", type: "vet", capacity: 8, booked: 7, color: "bg-green-500" },
    { id: 3, name: "Room 1", type: "room", capacity: 12, booked: 9, color: "bg-purple-500" },
    { id: 4, name: "Room 2", type: "room", capacity: 12, booked: 8, color: "bg-orange-500" },
    { id: 5, name: "Surgery Suite", type: "equipment", capacity: 4, booked: 2, color: "bg-red-500" },
    { id: 6, name: "X-Ray Machine", type: "equipment", capacity: 6, booked: 4, color: "bg-teal-500" },
  ]

  const mockAppointments = [
    {
      id: 1,
      time: "09:00",
      duration: 30,
      patient: "Buddy",
      owner: "Sarah Wilson",
      service: "Checkup",
      vet: "Dr. Smith",
      room: "Room 1",
      status: "confirmed",
    },
    {
      id: 2,
      time: "09:30",
      duration: 60,
      patient: "Luna",
      owner: "Mike Chen",
      service: "Surgery",
      vet: "Dr. Johnson",
      room: "Surgery Suite",
      status: "in-progress",
    },
    {
      id: 3,
      time: "10:00",
      duration: 30,
      patient: "Max",
      owner: "Emma Davis",
      service: "Vaccination",
      vet: "Dr. Smith",
      room: "Room 2",
      status: "waiting",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "in-progress":
        return "secondary"
      case "waiting":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Master Calendar
        </h2>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Resource Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resource Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockResources.map((resource) => (
                <div key={resource.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${resource.color}`} />
                      <span className="text-sm font-medium">{resource.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {resource.booked}/{resource.capacity}
                    </span>
                  </div>
                  <Progress value={(resource.booked / resource.capacity) * 100} className="h-2" />
                  <div className="flex items-center gap-2">
                    {resource.type === "vet" && <Users className="h-3 w-3 text-muted-foreground" />}
                    {resource.type === "room" && <MapPin className="h-3 w-3 text-muted-foreground" />}
                    {resource.type === "equipment" && <Settings className="h-3 w-3 text-muted-foreground" />}
                    <span className="text-xs text-muted-foreground capitalize">{resource.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Time slots */}
              <div className="grid grid-cols-1 gap-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const hour = 9 + i
                  const timeSlot = `${hour.toString().padStart(2, "0")}:00`
                  const appointment = mockAppointments.find((apt) => apt.time === timeSlot)

                  return (
                    <div key={timeSlot} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-16 text-sm font-medium">{timeSlot}</div>
                      <div className="flex-1">
                        {appointment ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">
                                {appointment.patient} - {appointment.owner}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {appointment.service} • {appointment.vet} • {appointment.room}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                              <Button variant="outline" size="sm">
                                Reassign
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Available</span>
                            <Button variant="outline" size="sm">
                              Book Slot
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Router */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Router</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium mb-2">Unassigned Bookings</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded text-sm">
                  Charlie - Dental Cleaning
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" variant="outline">
                      Assign to Dr. Smith
                    </Button>
                  </div>
                </div>
                <div className="p-2 border rounded text-sm">
                  Bella - Emergency
                  <div className="flex gap-1 mt-1">
                    <Button size="sm" variant="destructive">
                      Urgent Assignment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Room Assignments</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded text-sm">Room 1: Buddy (Dr. Smith)</div>
                <div className="p-2 border rounded text-sm">Surgery Suite: Luna (Dr. Johnson)</div>
                <div className="p-2 border rounded text-sm">Room 2: Available</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Equipment Schedule</h4>
              <div className="space-y-2">
                <div className="p-2 border rounded text-sm">X-Ray: Available at 11:00</div>
                <div className="p-2 border rounded text-sm">Ultrasound: Booked until 14:00</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
