"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Phone, Mail, Globe, Calendar, Shield } from "lucide-react"
import { useState } from "react"
import { BookingModal } from "./booking-modal"

interface ProviderProfileProps {
  provider: {
    id: string
    full_name: string
    avatar_url?: string
    bio?: string
    organizations: {
      id: string
      name: string
      org_type: string
      description?: string
      address?: string
      phone?: string
      email?: string
      website?: string
      hours?: any
      is_verified: boolean
      created_at: string
    }
    services?: Array<{
      id: string
      name: string
      description?: string
      price_min?: number
      price_max?: number
      duration_minutes?: number
      is_active: boolean
    }>
    reviews?: Array<{
      id: string
      rating: number
      comment?: string
      created_at: string
      reviewer: { full_name: string }
    }>
  }
}

export function ProviderProfile({ provider }: ProviderProfileProps) {
  const [showBooking, setShowBooking] = useState(false)
  const { organizations: org, services = [], reviews = [] } = provider

  const avgRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const getOrgTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      clinic: "Veterinary Clinic",
      ngo: "Animal Rescue NGO",
      breeder: "Professional Breeder",
      hostel: "Pet Boarding Facility",
      solo_provider: "Independent Provider",
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32">
              <AvatarImage src={provider.avatar_url || "/placeholder.svg"} alt={provider.full_name} />
              <AvatarFallback className="text-2xl">
                {provider.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{provider.full_name}</h1>
                {org.is_verified && (
                  <Badge variant="secondary" className="gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>

              <h2 className="text-xl text-gray-600 mb-3">{org.name}</h2>
              <Badge variant="outline" className="mb-4">
                {getOrgTypeLabel(org.org_type)}
              </Badge>

              {avgRating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {avgRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowBooking(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                {org.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${org.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {(org.description || provider.bio) && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{org.description || provider.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {services
                      .filter((s) => s.is_active)
                      .map((service) => (
                        <div key={service.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{service.name}</h3>
                            <div className="text-right">
                              {service.price_min && service.price_max ? (
                                <span className="font-medium">
                                  ₹{service.price_min} - ₹{service.price_max}
                                </span>
                              ) : service.price_min ? (
                                <span className="font-medium">₹{service.price_min}</span>
                              ) : null}
                            </div>
                          </div>
                          {service.description && <p className="text-gray-600 text-sm mb-2">{service.description}</p>}
                          {service.duration_minutes && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {service.duration_minutes} minutes
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.reviewer.full_name}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && <p className="text-gray-700">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {org.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                    <span className="text-sm">{org.address}</span>
                  </div>
                )}
                {org.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${org.phone}`} className="text-sm hover:underline">
                      {org.phone}
                    </a>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${org.email}`} className="text-sm hover:underline">
                      {org.email}
                    </a>
                  </div>
                )}
                {org.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hours */}
            {org.hours && (
              <Card>
                <CardHeader>
                  <CardTitle>Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(org.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}</span>
                        <span>{hours as string}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          providerId={provider.id}
          providerName={provider.full_name}
          services={services.filter((s) => s.is_active)}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  )
}
