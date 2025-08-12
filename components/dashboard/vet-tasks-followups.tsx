"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, Phone, Calendar, AlertCircle, Search } from "lucide-react"

export function VetTasksFollowups() {
  const [searchQuery, setSearchQuery] = useState("")

  const mockCallbacks = [
    {
      id: 1,
      patient: "Buddy",
      owner: "Sarah Wilson",
      phone: "(555) 123-4567",
      reason: "Post-surgery check-in",
      priority: "high",
      dueDate: "2024-01-15",
      status: "pending",
      notes: "Check on hip replacement recovery",
    },
    {
      id: 2,
      patient: "Luna",
      owner: "Mike Chen",
      phone: "(555) 987-6543",
      reason: "Diabetes management follow-up",
      priority: "medium",
      dueDate: "2024-01-16",
      status: "pending",
      notes: "Review blood glucose levels",
    },
    {
      id: 3,
      patient: "Max",
      owner: "Emma Davis",
      phone: "(555) 456-7890",
      reason: "Medication adjustment",
      priority: "low",
      dueDate: "2024-01-18",
      status: "completed",
      notes: "Arthritis medication working well",
    },
  ]

  const mockRechecks = [
    {
      id: 1,
      patient: "Charlie",
      owner: "John Smith",
      condition: "Ear infection",
      recheckDate: "2024-01-20",
      originalVisit: "2024-01-10",
      status: "scheduled",
      notes: "Check if antibiotic treatment is effective",
    },
    {
      id: 2,
      patient: "Bella",
      owner: "Lisa Johnson",
      condition: "Skin allergy",
      recheckDate: "2024-01-22",
      originalVisit: "2024-01-08",
      status: "pending",
      notes: "Evaluate response to new diet",
    },
    {
      id: 3,
      patient: "Rocky",
      owner: "Tom Wilson",
      condition: "Dental cleaning",
      recheckDate: "2024-01-25",
      originalVisit: "2024-01-15",
      status: "pending",
      notes: "Post-dental procedure check",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "scheduled":
        return "secondary"
      case "pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Tasks & Follow-ups
        </h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="w-[200px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Callbacks</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCallbacks.filter((c) => c.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Need to call</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Rechecks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRechecks.filter((r) => r.status === "scheduled").length}</div>
            <p className="text-xs text-muted-foreground">Appointments booked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockCallbacks.filter((c) => c.priority === "high" && c.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent callbacks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockCallbacks.filter((c) => c.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Tasks done</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="callbacks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="callbacks">Callback List</TabsTrigger>
          <TabsTrigger value="rechecks">Recheck Planner</TabsTrigger>
        </TabsList>

        <TabsContent value="callbacks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Callback List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCallbacks.map((callback) => (
                  <div key={callback.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {callback.patient} - {callback.owner}
                        </h4>
                        <p className="text-sm text-muted-foreground">{callback.phone}</p>
                        <p className="text-sm">{callback.reason}</p>
                        {callback.notes && <p className="text-xs text-muted-foreground mt-1">{callback.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {new Date(callback.dueDate).toLocaleDateString()}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={getPriorityColor(callback.priority)}>{callback.priority}</Badge>
                          <Badge variant={getStatusColor(callback.status)}>{callback.status}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          Mark Done
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rechecks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recheck Planner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRechecks.map((recheck) => (
                  <div key={recheck.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {recheck.patient} - {recheck.owner}
                        </h4>
                        <p className="text-sm text-muted-foreground">{recheck.condition}</p>
                        <p className="text-xs text-muted-foreground">
                          Original visit: {new Date(recheck.originalVisit).toLocaleDateString()}
                        </p>
                        {recheck.notes && <p className="text-xs text-muted-foreground mt-1">{recheck.notes}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          Recheck: {new Date(recheck.recheckDate).toLocaleDateString()}
                        </p>
                        <Badge variant={getStatusColor(recheck.status)} className="mt-1">
                          {recheck.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Schedule
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
