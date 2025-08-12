"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, CreditCard, MapPin, AlertTriangle, CheckCircle, Clock, Printer, Phone } from "lucide-react"

export function FrontDeskDashboard() {
  const [activeTab, setActiveTab] = useState("checkin")

  const mockCheckInQueue = [
    {
      id: 1,
      patient: "Buddy",
      owner: "Sarah Wilson",
      appointmentTime: "09:00",
      status: "arrived",
      service: "Checkup",
      vet: "Dr. Smith",
      room: null,
      token: "A001",
    },
    {
      id: 2,
      patient: "Luna",
      owner: "Mike Chen",
      appointmentTime: "09:30",
      status: "roomed",
      service: "Surgery",
      vet: "Dr. Johnson",
      room: "Room 1",
      token: "A002",
    },
    {
      id: 3,
      patient: "Max",
      owner: "Emma Davis",
      appointmentTime: "10:00",
      status: "with-vet",
      service: "Vaccination",
      vet: "Dr. Smith",
      room: "Room 2",
      token: "A003",
    },
  ]

  const mockRooms = [
    { id: 1, name: "Room 1", status: "occupied", patient: "Luna", vet: "Dr. Johnson" },
    { id: 2, name: "Room 2", status: "occupied", patient: "Max", vet: "Dr. Smith" },
    { id: 3, name: "Room 3", status: "cleaning", patient: null, vet: null },
    { id: 4, name: "Surgery Suite", status: "available", patient: null, vet: null },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "arrived":
        return "secondary"
      case "roomed":
        return "default"
      case "with-vet":
        return "default"
      case "occupied":
        return "destructive"
      case "cleaning":
        return "secondary"
      case "available":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Front Desk</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print Token
          </Button>
          <Button variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Intake
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="checkin">Check-in/Out</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockCheckInQueue.filter((p) => p.status === "arrived").length}
                </div>
                <p className="text-xs text-muted-foreground">Patients arrived</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Rooms</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockCheckInQueue.filter((p) => p.status === "roomed").length}</div>
                <p className="text-xs text-muted-foreground">Waiting for vet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">With Vet</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockCheckInQueue.filter((p) => p.status === "with-vet").length}
                </div>
                <p className="text-xs text-muted-foreground">In consultation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockRooms.filter((r) => r.status === "available").length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for patients</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Check-in Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCheckInQueue.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">{patient.token}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {patient.patient} - {patient.owner}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {patient.service} • {patient.vet} • {patient.appointmentTime}
                        </p>
                        {patient.room && <p className="text-xs text-blue-600">Currently in: {patient.room}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(patient.status)}>{patient.status.replace("-", " ")}</Badge>
                      <div className="flex gap-2">
                        {patient.status === "arrived" && <Button size="sm">Assign Room</Button>}
                        {patient.status === "with-vet" && (
                          <Button size="sm" variant="outline">
                            Check Out
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pet Name</label>
                  <Input placeholder="Enter pet name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Owner Name</label>
                  <Input placeholder="Enter owner name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Service</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checkup">Routine Checkup</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Preferred Vet</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Create Booking</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Buddy - Sarah Wilson</h4>
                      <p className="text-sm text-muted-foreground">Routine Checkup</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">$85.00</p>
                      <Badge variant="secondary">Pending Payment</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                    <Button variant="outline">Generate Invoice</Button>
                    <Button variant="outline">Print Receipt</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockRooms.map((room) => (
                  <Card
                    key={room.id}
                    className={`${
                      room.status === "occupied"
                        ? "border-red-200 bg-red-50"
                        : room.status === "cleaning"
                          ? "border-yellow-200 bg-yellow-50"
                          : "border-green-200 bg-green-50"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{room.name}</CardTitle>
                      <Badge variant={getStatusColor(room.status)} className="w-fit">
                        {room.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      {room.patient ? (
                        <div>
                          <p className="text-sm font-medium">{room.patient}</p>
                          <p className="text-xs text-muted-foreground">{room.vet}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Available</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Emergency Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pet Name *</label>
                  <Input placeholder="Enter pet name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Owner Name *</label>
                  <Input placeholder="Enter owner name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Emergency Description *</label>
                <Input placeholder="Brief description of emergency" />
              </div>
              <div className="flex gap-2">
                <Button variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Create Emergency Case
                </Button>
                <Button variant="outline">Notify Team</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
