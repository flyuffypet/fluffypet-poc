"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, AlertTriangle, Stethoscope, Thermometer, Activity } from "lucide-react"

interface VetTodayProps {
  data: any
}

export function VetToday({ data }: VetTodayProps) {
  const todayAppointments = data?.todayAppointments || []
  const triageQueue = [
    {
      id: 1,
      pet: "Max",
      owner: "Sarah Wilson",
      severity: "high",
      complaint: "Difficulty breathing, lethargy",
      eta: "10 min",
      room: "Exam 1",
    },
    {
      id: 2,
      pet: "Luna",
      owner: "Mike Chen",
      severity: "medium",
      complaint: "Limping on left front paw",
      eta: "25 min",
      room: "Exam 2",
    },
    {
      id: 3,
      pet: "Charlie",
      owner: "Emma Davis",
      severity: "low",
      complaint: "Routine checkup and vaccinations",
      eta: "45 min",
      room: "Exam 3",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter((a: any) => a.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Triage Queue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{triageQueue.length}</div>
            <p className="text-xs text-muted-foreground">
              {triageQueue.filter((t) => t.severity === "high").length} urgent cases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 min</div>
            <p className="text-xs text-muted-foreground">-5 min from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">3 of 4 rooms occupied</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Triage Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {triageQueue.map((case_) => (
                <div key={case_.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">
                        {case_.pet} - {case_.owner}
                      </h4>
                      <p className="text-sm text-muted-foreground">{case_.room}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(case_.severity)}>{case_.severity}</Badge>
                      <Badge variant="outline">ETA: {case_.eta}</Badge>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{case_.complaint}</p>
                  <div className="flex gap-2">
                    <Button size="sm">See Patient</Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Quick Vitals
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        {appointment.pets?.photo_url ? (
                          <img
                            src={appointment.pets.photo_url || "/placeholder.svg"}
                            alt={appointment.pets.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="text-lg font-semibold">{appointment.pets?.name?.charAt(0) || "P"}</div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.pets?.name || "Unknown Pet"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {appointment.profiles?.first_name} {appointment.profiles?.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(appointment.scheduled_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          • {appointment.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appointment.status === "completed"
                            ? "default"
                            : appointment.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Start Visit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Vitals Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Quick Vitals Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <div className="relative">
                <Thermometer className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="temperature" placeholder="101.5" className="pl-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
              <Input id="heart-rate" placeholder="120" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="respiratory-rate">Respiratory Rate</Label>
              <Input id="respiratory-rate" placeholder="24" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input id="weight" placeholder="45.2" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>Save Vitals</Button>
            <Button variant="outline" className="bg-transparent">
              Add to Current Visit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
