"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

export function ClinicOverview() {
  const mockKPIs = {
    appointmentsToday: 24,
    averageWaitTime: 15,
    utilizationRate: 78,
    revenue: 4250,
    activeStaff: 8,
    roomsOccupied: 6,
    totalRooms: 8,
  }

  const mockTrends = [
    { name: "Appointments", value: "+12%", trend: "up" },
    { name: "Revenue", value: "+8%", trend: "up" },
    { name: "Wait Time", value: "-5%", trend: "down" },
    { name: "Satisfaction", value: "+3%", trend: "up" },
  ]

  const mockQuickLinks = [
    { name: "Schedule Emergency", icon: AlertTriangle, urgent: true },
    { name: "Add Walk-in", icon: Users, urgent: false },
    { name: "Staff Schedule", icon: Calendar, urgent: false },
    { name: "Inventory Alert", icon: Activity, urgent: true },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.appointmentsToday}</div>
            <p className="text-xs text-muted-foreground">{Math.round(mockKPIs.appointmentsToday * 0.8)} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.averageWaitTime}m</div>
            <p className="text-xs text-green-600">-5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.utilizationRate}%</div>
            <Progress value={mockKPIs.utilizationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockKPIs.revenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">+8% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Sparklines */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockTrends.map((trend) => (
                <div key={trend.name} className="text-center">
                  <p className="text-sm font-medium">{trend.name}</p>
                  <p className={`text-lg font-bold ${trend.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {trend.value}
                  </p>
                  <div className="h-8 bg-muted rounded mt-2 flex items-center justify-center">
                    <div className="text-xs text-muted-foreground">📈</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockQuickLinks.map((link) => (
                <Button
                  key={link.name}
                  variant={link.urgent ? "destructive" : "outline"}
                  className="w-full justify-start"
                  size="sm"
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.name}
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Occupied</span>
              <span className="text-sm font-medium">
                {mockKPIs.roomsOccupied}/{mockKPIs.totalRooms}
              </span>
            </div>
            <Progress value={(mockKPIs.roomsOccupied / mockKPIs.totalRooms) * 100} />
            <p className="text-xs text-muted-foreground mt-2">
              {mockKPIs.totalRooms - mockKPIs.roomsOccupied} rooms available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Staff Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{mockKPIs.activeStaff} staff on duty</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Veterinarians</span>
                <span>3/3</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Technicians</span>
                <span>4/5</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Front Desk</span>
                <span>1/2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">Low vaccine stock</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">All equipment operational</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">3 pending reviews</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
