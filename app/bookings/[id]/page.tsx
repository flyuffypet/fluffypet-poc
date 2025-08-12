"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Phone, Mail } from "lucide-react"
import ChatWidget from "@/components/chat/chat-widget"
import { createClient } from "@/lib/supabase-client"
import { format } from "date-fns"

interface Booking {
  id: string
  status: string
  scheduled_at: string
  duration_minutes: number
  total_cost: number
  notes?: string
  pet: {
    id: string
    name: string
    species: string
    breed?: string
    photo_url?: string
  }
  owner: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
  provider: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone?: string
    avatar_url?: string
  }
  service: {
    name: string
    description?: string
  }
}

export default function BookingDetailPage() {
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<Booking | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadBookingAndUser() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")
        setCurrentUser(user)

        // Get booking details
        const { data: bookingData, error: bookingError } = await supabase
          .from("bookings")
          .select(`
            id,
            status,
            scheduled_at,
            duration_minutes,
            total_cost,
            notes,
            pet:pets(id, name, species, breed, photo_url),
            owner:profiles!bookings_pet_owner_id_fkey(id, first_name, last_name, email, phone, avatar_url),
            provider:profiles!bookings_provider_id_fkey(id, first_name, last_name, email, phone, avatar_url),
            service:services(name, description)
          `)
          .eq("id", bookingId)
          .single()

        if (bookingError) throw bookingError
        setBooking(bookingData as Booking)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadBookingAndUser()
  }, [bookingId, supabase])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-destructive">Failed to load booking details</p>
            {error && <p className="text-sm text-muted-foreground mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = currentUser?.id === booking.owner.id
  const isProvider = currentUser?.id === booking.provider.id
  const otherParty = isOwner ? booking.provider : booking.owner
  const currentUserProfile = isOwner ? booking.owner : booking.provider

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">#{booking.id.slice(-8)}</p>
        </div>
        <Badge className={getStatusColor(booking.status)}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Information */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{format(new Date(booking.scheduled_at), "EEEE, MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(booking.scheduled_at), "h:mm a")}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{booking.duration_minutes} minutes</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-5 w-5 text-muted-foreground">$</div>
              <div>
                <p className="font-medium">${booking.total_cost}</p>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Service</p>
              <p className="text-sm">{booking.service.name}</p>
              {booking.service.description && (
                <p className="text-sm text-muted-foreground mt-1">{booking.service.description}</p>
              )}
            </div>

            {booking.notes && (
              <div>
                <p className="font-medium mb-2">Notes</p>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pet Information */}
        <Card>
          <CardHeader>
            <CardTitle>Pet Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={booking.pet.photo_url || "/placeholder.svg"} />
                <AvatarFallback>{booking.pet.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{booking.pet.name}</h3>
                <p className="text-muted-foreground">
                  {booking.pet.breed ? `${booking.pet.breed} ` : ""}
                  {booking.pet.species}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{isOwner ? "Service Provider" : "Pet Owner"} Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={otherParty.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>
                  {otherParty.first_name.charAt(0)}
                  {otherParty.last_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {otherParty.first_name} {otherParty.last_name}
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{otherParty.email}</span>
              </div>
              {otherParty.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{otherParty.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Widget */}
      {(isOwner || isProvider) && (
        <ChatWidget
          bookingId={booking.id}
          userId={currentUser.id}
          userName={`${currentUserProfile.first_name} ${currentUserProfile.last_name}`}
          userAvatar={currentUserProfile.avatar_url}
          recipientName={`${otherParty.first_name} ${otherParty.last_name}`}
        />
      )}
    </div>
  )
}
