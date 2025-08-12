"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"

export function ProviderCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"week" | "month">("week")

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

  const mockBookings = [
    { id: 1, time: "9:00", duration: 60, client: "John Doe", pet: "Buddy", service: "Grooming" },
    { id: 2, time: "14:30", duration: 90, client: "Jane Smith", pet: "Luna", service: "Training" },
    { id: 3, time: "16:00", duration: 45, client: "Mike Johnson", pet: "Max", service: "Walking" },
  ]

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Calendar & Availability</h2>
          <div className="flex items-center gap-2">
            <Button variant={view === "week" ? "default" : "outline"} size="sm" onClick={() => setView("week")}>
              Week
            </Button>
            <Button variant={view === "month" ? "default" : "outline"} size="sm" onClick={() => setView("month")}>
              Month
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
          <Button variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Block Time
          </Button>
        </div>
      </div>

      {/* Week View */}
      {view === "week" && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-8 border-b">
              <div className="p-4 border-r bg-muted/50">
                <span className="text-sm font-medium">Time</span>
              </div>
              {weekDays.map((day) => (
                <div key={day} className="p-4 border-r text-center">
                  <div className="text-sm font-medium">{day}</div>
                  <div className="text-xs text-muted-foreground">Jan {Math.floor(Math.random() * 28) + 1}</div>
                </div>
              ))}
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-8 border-b min-h-[60px]">
                  <div className="p-2 border-r bg-muted/50 flex items-center">
                    <span className="text-xs text-muted-foreground">{time}</span>
                  </div>
                  {weekDays.map((day, dayIndex) => (
                    <div key={`${day}-${time}`} className="p-1 border-r relative">
                      {/* Mock booking for demonstration */}
                      {dayIndex === 2 && time === "9:00" && (
                        <div className="bg-blue-100 border border-blue-300 rounded p-1 text-xs">
                          <div className="font-medium">Buddy - Grooming</div>
                          <div className="text-muted-foreground">John Doe</div>
                        </div>
                      )}
                      {dayIndex === 4 && time === "14:00" && (
                        <div className="bg-green-100 border border-green-300 rounded p-1 text-xs">
                          <div className="font-medium">Luna - Training</div>
                          <div className="text-muted-foreground">Jane Smith</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Working Hours</h4>
              <div className="space-y-2">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">9:00 AM - 6:00 PM</Badge>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Service Slots</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Grooming</span>
                    <Badge>60 min</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Available every hour</p>
                </div>
                <div className="p-3 border rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Training</span>
                    <Badge>90 min</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Available every 2 hours</p>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service Slot
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
