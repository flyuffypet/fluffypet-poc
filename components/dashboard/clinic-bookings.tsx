"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, AlertTriangle, CheckCircle, Users, Calendar } from "lucide-react"

export function ClinicBookings() {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const mockBookings = [
    {
      id: "1",
      patient: "Buddy",
      owner: "Sarah Wilson",
      service: "Routine Checkup",
      requestedTime: "2024-01-15 10:00",
      priority: "routine",
      status: "pending",
      slaStatus: "on-time",
      timeRemaining: "2h 30m",
      phone: "(555) 123-4567",
      notes: "First visit, nervous dog",
    },
    {
      id: "2",
      patient: "Luna",
      owner: "Mike Chen",
      service: "Emergency Visit",
      requestedTime: "2024-01-15 09:00",
      priority: "urgent",
      status: "assigned",
      slaStatus: "at-risk",
      timeRemaining: "45m",
      phone: "(555) 987-6543",
      notes: "Possible poisoning, needs immediate attention",
      assignedTo: "Dr. Johnson",
      room: "Room 1",
    },
    {
      id: "3",
      patient: "Max",
      owner: "Emma Davis",
      service: "Vaccination",
      requestedTime: "2024-01-15 14:00",
      priority: "routine",
      status: "confirmed",
      slaStatus: "on-time",
      timeRemaining: "6h 15m",
      phone: "(555) 456-7890",
      notes: "Annual vaccines due",
      assignedTo: "Dr. Smith",
      room: "Room 2",
    },
    {
      id: "4",
      patient: "Charlie",
      owner: "John Smith",
      service: "Dental Cleaning",
      requestedTime: "2024-01-15 11:30",
      priority: "routine",
      status: "pending",
      slaStatus: "overdue",
      timeRemaining: "Overdue by 1h",
      phone: "(555) 321-9876",
      notes: "Pre-anesthetic bloodwork completed",
    },
  ]

  const getSLAColor = (slaStatus: string) => {
    switch (slaStatus) {
      case "on-time":
        return "default"
      case "at-risk":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "routine":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "assigned":
        return "default"
      case "confirmed":
        return "default"
      default:
        return "secondary"
    }
  }

  const handleBookingSelect = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId) ? prev.filter((id) => id !== bookingId) : [...prev, bookingId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Bookings & Requests
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBookings.filter((b) => b.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Need assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA At Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {mockBookings.filter((b) => b.slaStatus === "at-risk").length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockBookings.filter((b) => b.slaStatus === "overdue").length}
            </div>
            <p className="text-xs text-muted-foreground">Immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockBookings.filter((b) => b.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready to go</p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{selectedBookings.length} bookings selected</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Bulk Assign
                </Button>
                <Button variant="outline" size="sm">
                  Send Reminders
                </Button>
                <Button variant="outline" size="sm">
                  Reschedule
                </Button>
                <Button variant="destructive" size="sm">
                  Cancel Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Inbox */}
      <Tabs defaultValue="inbox" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbox">Booking Inbox</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedBookings.includes(booking.id)}
                        onCheckedChange={() => handleBookingSelect(booking.id)}
                      />
                      <div>
                        <h4 className="font-medium">
                          {booking.patient} - {booking.owner}
                        </h4>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {new Date(booking.requestedTime).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
                        {booking.notes && <p className="text-xs text-muted-foreground mt-1">{booking.notes}</p>}
                        {booking.assignedTo && (
                          <p className="text-xs text-blue-600 mt-1">
                            Assigned to: {booking.assignedTo} • {booking.room}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex gap-2 mb-2">
                          <Badge variant={getPriorityColor(booking.priority)}>{booking.priority}</Badge>
                          <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                          <Badge variant={getSLAColor(booking.slaStatus)}>{booking.slaStatus}</Badge>
                        </div>
                        <p className="text-sm font-medium">{booking.timeRemaining}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Assign
                        </Button>
                        <Button variant="outline" size="sm">
                          Route
                        </Button>
                        <Button variant="destructive" size="sm">
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assigned">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Assigned Bookings</h3>
                <p className="text-muted-foreground">Bookings assigned to staff members will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="confirmed">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Confirmed Bookings</h3>
                <p className="text-muted-foreground">Confirmed appointments ready for service</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
