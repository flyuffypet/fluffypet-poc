"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Inbox, Check, X, DollarSign, Calendar } from "lucide-react"

export function ProviderRequests() {
  const mockRequests = [
    {
      id: 1,
      client: "Sarah Wilson",
      pet: "Charlie",
      service: "Dog Walking",
      requestedDate: "2024-01-15",
      message: "Looking for daily walks for my energetic golden retriever. Preferably morning walks.",
      status: "pending",
      budget: "$25/walk",
    },
    {
      id: 2,
      client: "Mike Chen",
      pet: "Whiskers",
      service: "Cat Sitting",
      requestedDate: "2024-01-20",
      message: "Need someone to check on my cat while I'm away for a week. Very friendly cat.",
      status: "pending",
      budget: "$30/day",
    },
    {
      id: 3,
      client: "Emma Davis",
      pet: "Rocky",
      service: "Dog Training",
      requestedDate: "2024-01-18",
      message: "My puppy needs basic obedience training. He's 6 months old and very playful.",
      status: "quoted",
      budget: "$80/session",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Service Requests
        </h2>
        <Badge variant="secondary">{mockRequests.filter((r) => r.status === "pending").length} New</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request List */}
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{request.service}</CardTitle>
                  <Badge variant={request.status === "pending" ? "default" : "secondary"}>{request.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Client:</span>
                    <p className="font-medium">{request.client}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pet:</span>
                    <p className="font-medium">{request.pet}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">{new Date(request.requestedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">{request.budget}</p>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Message:</span>
                  <p className="text-sm mt-1">{request.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Quote
                  </Button>
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Quote Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-price">Service Price</Label>
              <Input id="service-price" placeholder="Enter price" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" placeholder="Enter duration" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availability">Available Dates</Label>
              <div className="flex gap-2">
                <Input type="date" />
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea id="terms" placeholder="Enter any special terms or requirements..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message to Client</Label>
              <Textarea id="message" placeholder="Add a personal message..." rows={3} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Send Quote</Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
