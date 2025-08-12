"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Heart, Share2, MessageCircle, Shield, Award, Clock, User, Phone, Mail } from "lucide-react"
import Image from "next/image"

interface Report {
  id: string
  type: "lost" | "found" | "reunited"
  petName: string
  species: string
  breed: string
  age: string
  gender: string
  size: string
  color: string
  location: string
  lastSeen: string
  description: string
  images: string[]
  contactInfo: {
    masked: boolean
    message: string
  }
  reporter: {
    name: string
    joinedDate: string
    reportsCount: number
    successfulReunions: number
  }
  reward?: string
  microchipped: boolean
  specialNeeds: string
  lastSeenDetails: string
  reportedAt: string
  status: string
}

interface ReportDetailProps {
  report: Report
}

export function ReportDetail({ report }: ReportDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lost":
        return "bg-red-100 text-red-800"
      case "found":
        return "bg-blue-100 text-blue-800"
      case "reunited":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Report Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{report.petName}</h1>
                <Badge className={getTypeColor(report.type)}>{report.type.toUpperCase()}</Badge>
                {report.status === "active" && <Badge variant="outline">Active</Badge>}
              </div>
              <p className="text-xl text-gray-600">
                {report.breed} • {report.species} • {report.age}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={report.images[currentImageIndex] || "/placeholder.svg"}
                alt={`${report.petName} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>
            {report.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {report.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">{report.gender}</div>
              <div className="text-sm text-gray-600">Gender</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">{report.size}</div>
              <div className="text-sm text-gray-600">Size</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">{report.color}</div>
              <div className="text-sm text-gray-600">Color</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">{report.microchipped ? "Yes" : "No"}</div>
              <div className="text-sm text-gray-600">Microchipped</div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="font-medium">Last seen: {report.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(report.lastSeen)}</span>
            </div>
            <p className="text-gray-700 ml-6">{report.lastSeenDetails}</p>
          </div>

          {/* Reward */}
          {report.reward && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Reward Offered: {report.reward}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <div className="prose max-w-none">
              {report.description.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-3 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Special Needs */}
          {report.specialNeeds && report.specialNeeds !== "None" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Special Needs</h4>
              <p className="text-blue-700">{report.specialNeeds}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.contactInfo.masked ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Secure Contact</span>
                    </div>
                    <p className="text-blue-700 text-sm mb-3">{report.contactInfo.message}</p>
                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => setShowContactForm(!showContactForm)}
                        disabled={!showContactForm}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Secure Message
                      </Button>
                      <p className="text-xs text-gray-600 text-center">
                        Sign in required to contact pet owner securely
                      </p>
                    </div>
                  </div>

                  {showContactForm && (
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Send a Message</h4>
                      <div className="space-y-3">
                        <textarea
                          className="w-full p-3 border rounded-lg resize-none"
                          rows={4}
                          placeholder="I have information about this pet..."
                        />
                        <div className="flex gap-2">
                          <Button size="sm">Send Message</Button>
                          <Button size="sm" variant="outline" onClick={() => setShowContactForm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>Direct contact available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email contact available</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reporter Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Reporter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={report.reporter.name} />
                  <AvatarFallback>
                    {report.reporter.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{report.reporter.name}</h4>
                  <p className="text-sm text-gray-600">
                    Member since {new Date(report.reporter.joinedDate).getFullYear()}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Reports submitted</span>
                  <span className="font-medium">{report.reporter.reportsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Successful reunions</span>
                  <span className="font-medium text-green-600">{report.reporter.successfulReunions}</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Reported {formatDate(report.reportedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
