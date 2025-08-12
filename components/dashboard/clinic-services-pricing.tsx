"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Plus, Settings, Clock } from "lucide-react"

export function ClinicServicesPricing() {
  const [activeTab, setActiveTab] = useState("services")

  const mockServices = [
    {
      id: 1,
      name: "Routine Checkup",
      category: "preventive",
      duration: 30,
      price: 85,
      status: "active",
      description: "Complete physical examination",
    },
    {
      id: 2,
      name: "Vaccination",
      category: "preventive",
      duration: 15,
      price: 45,
      status: "active",
      description: "Annual vaccinations",
    },
    {
      id: 3,
      name: "Dental Cleaning",
      category: "dental",
      duration: 120,
      price: 350,
      status: "active",
      description: "Professional dental cleaning under anesthesia",
    },
    {
      id: 4,
      name: "Surgery Consultation",
      category: "surgery",
      duration: 45,
      price: 125,
      status: "active",
      description: "Pre-surgical consultation and planning",
    },
  ]

  const mockPriceRules = [
    {
      id: 1,
      name: "Senior Pet Discount",
      type: "percentage",
      value: 10,
      condition: "pet_age > 7",
      status: "active",
    },
    {
      id: 2,
      name: "Multi-Pet Family",
      type: "percentage",
      value: 15,
      condition: "family_pets >= 3",
      status: "active",
    },
    {
      id: 3,
      name: "Emergency Surcharge",
      type: "fixed",
      value: 50,
      condition: "after_hours = true",
      status: "active",
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "preventive":
        return "default"
      case "dental":
        return "secondary"
      case "surgery":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Services & Pricing
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Service Catalog</TabsTrigger>
          <TabsTrigger value="pricing">Price Rules</TabsTrigger>
          <TabsTrigger value="bundles">Service Bundles</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Services</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockServices.length}</div>
                <p className="text-xs text-muted-foreground">Active services</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${Math.round(mockServices.reduce((sum, s) => sum + s.price, 0) / mockServices.length)}
                </div>
                <p className="text-xs text-muted-foreground">Per service</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(mockServices.reduce((sum, s) => sum + s.duration, 0) / mockServices.length)}m
                </div>
                <p className="text-xs text-muted-foreground">Per appointment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue/Hour</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$142</div>
                <p className="text-xs text-green-600">+8% this month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getCategoryColor(service.category)}>{service.category}</Badge>
                        <span className="text-xs text-muted-foreground">{service.duration} minutes</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold">${service.price}</p>
                        <Badge variant="default">{service.status}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Price Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPriceRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <p className="text-sm text-muted-foreground">Condition: {rule.condition}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{rule.type}</Badge>
                        <span className="text-sm font-medium">
                          {rule.type === "percentage" ? `${rule.value}%` : `$${rule.value}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">{rule.status}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Disable
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundles" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Service Bundles</h3>
                <p className="text-muted-foreground">Create service packages with discounted pricing</p>
                <Button className="mt-4">Create Bundle</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
