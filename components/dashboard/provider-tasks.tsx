"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Clock, CheckCircle, AlertCircle, Navigation } from "lucide-react"

export function ProviderTasks() {
  const mockTasks = [
    {
      id: 1,
      type: "pickup",
      client: "Sarah Wilson",
      pet: "Charlie",
      address: "123 Oak Street, Downtown",
      time: "9:00 AM",
      status: "pending",
      priority: "high",
      notes: "Ring doorbell twice, Charlie gets excited",
    },
    {
      id: 2,
      type: "dropoff",
      client: "Mike Chen",
      pet: "Whiskers",
      address: "456 Pine Avenue, Midtown",
      time: "11:30 AM",
      status: "in_progress",
      priority: "medium",
      notes: "Leave carrier by front door if no answer",
    },
    {
      id: 3,
      type: "pickup",
      client: "Emma Davis",
      pet: "Rocky",
      address: "789 Elm Drive, Uptown",
      time: "2:00 PM",
      status: "pending",
      priority: "medium",
      notes: "Use side gate, main door is broken",
    },
    {
      id: 4,
      type: "dropoff",
      client: "John Smith",
      pet: "Luna",
      address: "321 Maple Court, Westside",
      time: "4:30 PM",
      status: "completed",
      priority: "low",
      notes: "Completed successfully",
    },
  ]

  const pendingTasks = mockTasks.filter((task) => task.status === "pending")
  const inProgressTasks = mockTasks.filter((task) => task.status === "in_progress")
  const completedTasks = mockTasks.filter((task) => task.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Tasks & Routes
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            View Map
          </Button>
          <Button size="sm">Optimize Route</Button>
        </div>
      </div>

      {/* Task Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTasks.filter((t) => t.priority === "high").length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Tasks finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg ${task.status === "completed" ? "bg-muted/50" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={task.status === "completed"} disabled={task.status === "completed"} />
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={task.type === "pickup" ? "default" : "secondary"}>{task.type}</Badge>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium mt-1">
                          {task.pet} - {task.client}
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{task.time}</p>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {task.address}
                    </div>
                    {task.notes && <p className="text-sm text-muted-foreground">{task.notes}</p>}
                  </div>

                  {task.status !== "completed" && (
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <MapPin className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                      {task.status === "pending" && <Button size="sm">Start Task</Button>}
                      {task.status === "in_progress" && <Button size="sm">Complete</Button>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Route Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Route Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Optimized Route</h4>
                <p className="text-sm text-blue-700 mb-3">Save 45 minutes and 12 miles with our suggested route</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      1
                    </div>
                    <span>Sarah Wilson - Charlie (Pickup)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      2
                    </div>
                    <span>Emma Davis - Rocky (Pickup)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      3
                    </div>
                    <span>Mike Chen - Whiskers (Dropoff)</span>
                  </div>
                </div>
                <Button size="sm" className="mt-3">
                  Use This Route
                </Button>
              </div>

              <div>
                <h4 className="font-medium mb-2">Route Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Distance</p>
                    <p className="font-medium">24.5 miles</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated Time</p>
                    <p className="font-medium">2h 15m</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fuel Cost</p>
                    <p className="font-medium">$8.50</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tasks</p>
                    <p className="font-medium">4 stops</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
