"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MapPin, Clock, Users, CheckCircle } from "lucide-react"
import { SOSAlert } from "@/components/sos/sos-alert"

export default function SOSDashboard() {
  const [activeTab, setActiveTab] = useState("active")

  const mockSOSAlerts = [
    {
      id: "1",
      type: "rescue" as const,
      description: "Injured dog by roadside, appears to have leg injury, conscious but not moving",
      location: "Near Central Park, 5th Avenue",
      timeAgo: "2 minutes ago",
      status: "new" as const,
      responderCount: 3,
      photo: "dog-injury.jpg",
    },
    {
      id: "2",
      type: "medical" as const,
      description: "Cat showing signs of heatstroke, panting heavily",
      location: "Downtown Shopping District",
      timeAgo: "15 minutes ago",
      status: "responding" as const,
      responderCount: 2,
    },
    {
      id: "3",
      type: "other" as const,
      description: "Lost golden retriever, wearing blue collar, very friendly",
      location: "Riverside Park Area",
      timeAgo: "1 hour ago",
      status: "resolved" as const,
      responderCount: 5,
    },
  ]

  const activeAlerts = mockSOSAlerts.filter((alert) => alert.status !== "resolved")
  const resolvedAlerts = mockSOSAlerts.filter((alert) => alert.status === "resolved")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          SOS Emergency Dashboard
        </h1>
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Map View
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responding</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockSOSAlerts.filter((a) => a.status === "responding").length}
            </div>
            <p className="text-xs text-muted-foreground">Help on the way</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Successfully helped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 min</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Alerts ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedAlerts.length})</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.length > 0 ? (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <SOSAlert key={alert.id} alert={alert} isResponder={true} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium mb-2">No Active Emergencies</h3>
                <p className="text-muted-foreground">All animals are safe right now!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="space-y-4">
            {resolvedAlerts.map((alert) => (
              <SOSAlert key={alert.id} alert={alert} isResponder={true} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Interactive Map</h3>
              <p className="text-muted-foreground mb-4">
                View all SOS alerts on an interactive map with real-time updates
              </p>
              <Button>Launch Map View</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
