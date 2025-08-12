"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, MapPin, Clock, Users, Shield } from "lucide-react"

export function ClinicSettings() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Clinic Settings
        </h2>
        <Button>Save All Changes</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="hours">Hours & Location</TabsTrigger>
          <TabsTrigger value="rooms">Rooms & Resources</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Clinic Name</label>
                <Input defaultValue="Happy Paws Veterinary Clinic" />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input defaultValue="(555) 123-4567" />
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input defaultValue="info@happypawsvet.com" />
              </div>

              <div>
                <label className="text-sm font-medium">Website</label>
                <Input defaultValue="https://happypawsvet.com" />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  defaultValue="We provide comprehensive veterinary care with a focus on preventive medicine and compassionate treatment for all pets."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Emergency Contact</label>
                <Input defaultValue="(555) 999-8888" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Street Address</label>
                <Input defaultValue="123 Main Street" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input defaultValue="Anytown" />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input defaultValue="CA" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input defaultValue="12345" />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input defaultValue="United States" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-medium w-24">{day}</span>
                    <div className="flex items-center gap-4">
                      <Switch defaultChecked={day !== "Sunday"} />
                      <Input defaultValue="08:00" className="w-20" disabled={day === "Sunday"} />
                      <span>to</span>
                      <Input defaultValue="18:00" className="w-20" disabled={day === "Sunday"} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Rooms & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Examination Rooms</h4>
                  <div className="space-y-3">
                    {["Room 1", "Room 2", "Room 3"].map((room) => (
                      <div key={room} className="flex items-center justify-between p-3 border rounded">
                        <span>{room}</span>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Specialized Areas</h4>
                  <div className="space-y-3">
                    {["Surgery Suite", "X-Ray Room", "Laboratory"].map((area) => (
                      <div key={area} className="flex items-center justify-between p-3 border rounded">
                        <span>{area}</span>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Equipment</h4>
                  <div className="space-y-3">
                    {["Ultrasound Machine", "Dental Unit", "Anesthesia Machine"].map((equipment) => (
                      <div key={equipment} className="flex items-center justify-between p-3 border rounded">
                        <span>{equipment}</span>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked />
                          <Button variant="outline" size="sm">
                            Schedule
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Clinic Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Appointment Policies</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Allow online booking</p>
                      <p className="text-sm text-muted-foreground">Patients can book appointments online</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Require deposit for surgery</p>
                      <p className="text-sm text-muted-foreground">Collect deposit when booking surgical procedures</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Cancellation policy (hours notice)</label>
                    <Input defaultValue="24" className="w-20 mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Payment Policies</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Accept credit cards</p>
                      <p className="text-sm text-muted-foreground">Process credit card payments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment plans available</p>
                      <p className="text-sm text-muted-foreground">Offer payment plans for large bills</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Payment terms (days)</label>
                    <Input defaultValue="30" className="w-20 mt-1" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Communication Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Send appointment reminders</p>
                      <p className="text-sm text-muted-foreground">Automatic reminders via SMS/email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Follow-up after visits</p>
                      <p className="text-sm text-muted-foreground">Check on patients after appointments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
