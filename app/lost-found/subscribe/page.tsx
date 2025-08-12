import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Bell, MapPin, Mail, Smartphone } from "lucide-react"
import Link from "next/link"

export default function SubscribeAlertsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lost-found">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lost & Found
              </Link>
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Location-Based Pet Alerts</h1>
            <p className="text-gray-600">
              Get notified when pets are reported lost or found in your area. Help reunite pets with their families.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-500" />
                  Set Up Your Alert Preferences
                </CardTitle>
                <CardDescription>
                  Sign in to customize your alert settings and help pets in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Your Address</Label>
                      <Input id="address" placeholder="Enter your address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="radius">Alert Radius</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select radius" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 mile</SelectItem>
                          <SelectItem value="3">3 miles</SelectItem>
                          <SelectItem value="5">5 miles</SelectItem>
                          <SelectItem value="10">10 miles</SelectItem>
                          <SelectItem value="25">25 miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Alert Types */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Alert Types</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="lost-alerts" />
                      <Label htmlFor="lost-alerts">Lost pet reports in my area</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="found-alerts" />
                      <Label htmlFor="found-alerts">Found pet reports in my area</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="reunion-alerts" />
                      <Label htmlFor="reunion-alerts">Happy reunion stories</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="urgent-alerts" />
                      <Label htmlFor="urgent-alerts">Urgent cases requiring immediate help</Label>
                    </div>
                  </div>
                </div>

                {/* Pet Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Pet Preferences</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="dogs" />
                        <Label htmlFor="dogs">Dogs</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cats" />
                        <Label htmlFor="cats">Cats</Label>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="birds" />
                        <Label htmlFor="birds">Birds</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="other-pets" />
                        <Label htmlFor="other-pets">Other Pets</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Methods */}
                <div className="space-y-4">
                  <h3 className="font-semibold">How would you like to be notified?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" />
                      <Label htmlFor="email-notifications" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms-notifications" />
                      <Label htmlFor="sms-notifications" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        SMS notifications (urgent cases only)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="push-notifications" />
                      <Label htmlFor="push-notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Push notifications
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                </div>

                {/* Sign In Required Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Sign In Required</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    You need to sign in to set up location-based alerts and help pets in your community.
                  </p>
                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <Link href="/login?redirect=/lost-found/subscribe">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/signup?redirect=/lost-found/subscribe">Create Account</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How Alerts Work */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How Alerts Work</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Set Your Location</h4>
                    <p className="text-xs text-gray-600">Define your address and alert radius</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Get Notified</h4>
                    <p className="text-xs text-gray-600">Receive alerts when pets are reported in your area</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Help Reunite</h4>
                    <p className="text-xs text-gray-600">Share information and help pets find their families</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Your location is only used for alert matching</p>
                  <p>• Contact information is never shared publicly</p>
                  <p>• You can unsubscribe at any time</p>
                  <p>• All communications are secure and encrypted</p>
                </div>
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  View Privacy Policy
                </Button>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Active Alert Subscribers</span>
                    <span className="font-semibold">15,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pets Reunited via Alerts</span>
                    <span className="font-semibold text-green-600">2,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Response Time</span>
                    <span className="font-semibold">12 minutes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Pet Alert Subscriptions - FluffyPet",
  description:
    "Set up location-based alerts for lost and found pets in your area. Help reunite pets with their families.",
}
