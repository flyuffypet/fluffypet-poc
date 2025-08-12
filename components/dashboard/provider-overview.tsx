"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, DollarSign, MessageCircle, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface ProviderOverviewProps {
  data: any
}

export function ProviderOverview({ data }: ProviderOverviewProps) {
  const todayBookings = data?.todayBookings || []
  const newBookings = todayBookings.filter((b: any) => b.status === "pending")
  const confirmedBookings = todayBookings.filter((b: any) => b.status === "confirmed")
  const completedBookings = todayBookings.filter((b: any) => b.status === "completed")

  const todayEarnings = completedBookings.reduce((sum: number, booking: any) => sum + (booking.total_cost || 0), 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayBookings.length}</div>
            <p className="text-xs text-muted-foreground">
              {newBookings.length} new, {confirmedBookings.length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${todayEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {completedBookings.length} completed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 from new clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Booking</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:30 PM</div>
            <p className="text-xs text-muted-foreground">Grooming - Buddy</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      {booking.pets?.photo_url ? (
                        <img
                          src={booking.pets.photo_url || "/placeholder.svg"}
                          alt={booking.pets.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="text-lg font-semibold">{booking.pets?.name?.charAt(0) || "P"}</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{booking.pets?.name || "Unknown Pet"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {booking.profiles?.first_name} {booking.profiles?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.start_date).toLocaleDateString()} - ${booking.total_cost}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        booking.status === "completed"
                          ? "default"
                          : booking.status === "confirmed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {booking.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {booking.status === "pending" && <AlertCircle className="h-3 w-3 mr-1" />}
                      {booking.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
