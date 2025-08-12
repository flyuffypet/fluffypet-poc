"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Settings, MapPin, DollarSign, Shield, Plus, X } from "lucide-react"

export function ProviderSettings() {
  const [services, setServices] = useState([
    { id: 1, name: "Dog Walking", duration: 30, price: 25, active: true },
    { id: 2, name: "Pet Grooming", duration: 90, price: 65, active: true },
    { id: 3, name: "Pet Sitting", duration: 480, price: 120, active: true },
    { id: 4, name: "Dog Training", duration: 60, price: 80, active: false },
  ])

  const [serviceArea, setServiceArea] = useState({
    radius: 15,
    center: "Downtown Area",
    zones: ["Downtown", "Midtown", "Uptown"],
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Provider Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Catalog */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Service Catalog
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch checked={service.active} />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.duration} min • ${service.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add New Service
            </Button>
          </CardContent>
        </Card>

        {/* Service Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Service Area
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="service-radius">Service Radius (miles)</Label>
                <Input
                  id="service-radius"
                  type="number"
                  value={serviceArea.radius}
                  onChange={(e) => setServiceArea({ ...serviceArea, radius: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="center-location">Center Location</Label>
                <Input
                  id="center-location"
                  value={serviceArea.center}
                  onChange={(e) => setServiceArea({ ...serviceArea, center: e.target.value })}
                />
              </div>
              <div>
                <Label>Coverage Zones</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {serviceArea.zones.map((zone, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {zone}
                      <X className="h-3 w-3 cursor-pointer" />
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Zone
                </Button>
              </div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Map visualization would appear here showing your service area coverage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Business Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Business Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="business-name">Business Name</Label>
                <Input id="business-name" placeholder="Your business name" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell clients about your experience and approach..." rows={4} />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Input id="experience" type="number" placeholder="5" />
              </div>
              <div>
                <Label htmlFor="specializations">Specializations</Label>
                <Input id="specializations" placeholder="e.g., Large dogs, Senior pets, Behavioral training" />
              </div>
              <div>
                <Label htmlFor="languages">Languages Spoken</Label>
                <Input id="languages" placeholder="e.g., English, Spanish, French" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Identity Verification</p>
                  <p className="text-sm text-muted-foreground">Government ID verified</p>
                </div>
                <Badge variant="default">Verified</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Background Check</p>
                  <p className="text-sm text-muted-foreground">Criminal background check</p>
                </div>
                <Badge variant="default">Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Insurance Certificate</p>
                  <p className="text-sm text-muted-foreground">Liability insurance</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Pet Care Certification</p>
                  <p className="text-sm text-muted-foreground">Professional certification</p>
                </div>
                <Badge variant="outline">Not Required</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Upload Documents
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Booking Requests</p>
                  <p className="text-sm text-muted-foreground">Get notified of new requests</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Booking Confirmations</p>
                  <p className="text-sm text-muted-foreground">Confirmation notifications</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment Notifications</p>
                  <p className="text-sm text-muted-foreground">Payment and payout updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Review Notifications</p>
                  <p className="text-sm text-muted-foreground">New reviews from clients</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Emails</p>
                  <p className="text-sm text-muted-foreground">Tips and platform updates</p>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" placeholder="America/New_York" />
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button className="w-full">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
