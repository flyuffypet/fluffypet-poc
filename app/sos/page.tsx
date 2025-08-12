"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, MapPin, Camera, Clock, Shield, Heart } from "lucide-react"
import { SOSGuidance } from "@/components/sos/sos-guidance"

export default function SOSPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [sosType, setSOSType] = useState<"rescue" | "medical" | "other" | null>(null)
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sosSubmitted, setSOSSubmitted] = useState(false)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          setLocationError("Unable to get your location. Please enable location services.")
        },
      )
    } else {
      setLocationError("Geolocation is not supported by this browser.")
    }
  }, [])

  const handleSOSSubmit = async () => {
    if (!sosType || !location) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSOSSubmitted(true)
    setIsSubmitting(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  if (sosSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-800">SOS Alert Sent Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-green-700">
                Your emergency alert has been sent to nearby volunteers, NGOs, and clinics.
              </p>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium mb-2">What happens next:</h4>
                <ul className="text-sm text-left space-y-1">
                  <li>• Nearby responders are being notified</li>
                  <li>• You'll receive updates as help is dispatched</li>
                  <li>• Keep your phone nearby for contact from responders</li>
                  <li>• Follow the safety guidance while waiting</li>
                </ul>
              </div>
              <Button onClick={() => window.location.reload()} variant="outline">
                Send Another SOS
              </Button>
            </CardContent>
          </Card>

          <SOSGuidance />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-800 mb-2">Animal Emergency SOS</h1>
          <p className="text-red-600">Fast help for animals in distress - no account required</p>
        </div>

        {/* Location Status */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-blue-600" />
              {location ? (
                <div>
                  <p className="font-medium text-green-700">Location detected</p>
                  <p className="text-sm text-muted-foreground">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                  </p>
                </div>
              ) : locationError ? (
                <div>
                  <p className="font-medium text-red-600">Location unavailable</p>
                  <p className="text-sm text-red-500">{locationError}</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-blue-600">Getting your location...</p>
                  <p className="text-sm text-muted-foreground">This helps us find nearby help</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SOS Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What kind of help is needed?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant={sosType === "rescue" ? "default" : "outline"}
              className="w-full justify-start h-auto p-4"
              onClick={() => setSOSType("rescue")}
            >
              <div className="text-left">
                <div className="font-medium">🚨 Rescue</div>
                <div className="text-sm opacity-80">Injured, trapped, or abandoned animal</div>
              </div>
            </Button>

            <Button
              variant={sosType === "medical" ? "default" : "outline"}
              className="w-full justify-start h-auto p-4"
              onClick={() => setSOSType("medical")}
            >
              <div className="text-left">
                <div className="font-medium">🏥 Medical Emergency</div>
                <div className="text-sm opacity-80">Urgent medical attention needed</div>
              </div>
            </Button>

            <Button
              variant={sosType === "other" ? "default" : "outline"}
              className="w-full justify-start h-auto p-4"
              onClick={() => setSOSType("other")}
            >
              <div className="text-left">
                <div className="font-medium">❓ Other</div>
                <div className="text-sm opacity-80">Lost pet, general assistance needed</div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Additional Details */}
        {sosType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Additional Details (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Brief description of the situation</label>
                <Textarea
                  placeholder="e.g., 'Injured dog by the roadside, appears to have leg injury, conscious but not moving'"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Photo (helps responders prepare)</label>
                <div className="flex items-center gap-3">
                  <Input type="file" accept="image/*" onChange={handlePhotoUpload} className="flex-1" />
                  <Camera className="h-5 w-5 text-muted-foreground" />
                </div>
                {photo && <p className="text-sm text-green-600 mt-1">Photo selected: {photo.name}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SOS Button */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <Button
              size="lg"
              className="w-full h-16 text-xl font-bold bg-red-600 hover:bg-red-700"
              onClick={handleSOSSubmit}
              disabled={!sosType || !location || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-6 w-6 mr-3 animate-spin" />
                  Sending SOS Alert...
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  SEND SOS ALERT
                </>
              )}
            </Button>

            {(!sosType || !location) && (
              <p className="text-sm text-muted-foreground mt-2">
                {!location && "Waiting for location... "}
                {!sosType && "Please select emergency type"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Safety Information */}
        <SOSGuidance />

        {/* Privacy Notice */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Privacy & Safety</p>
                <p className="text-muted-foreground">
                  Your personal details are not shared publicly. Responders contact you safely through our platform.
                  Only your approximate location and emergency details are visible to nearby helpers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
