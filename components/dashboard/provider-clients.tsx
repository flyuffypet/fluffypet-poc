"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Search, Users, MessageCircle, Phone, Mail } from "lucide-react"

export function ProviderClients() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const mockClients = [
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "(555) 123-4567",
      pets: [
        { name: "Charlie", species: "Dog", breed: "Golden Retriever", photo: null },
        { name: "Bella", species: "Cat", breed: "Persian", photo: null },
      ],
      totalBookings: 12,
      lastBooking: "2024-01-10",
      notes: "Prefers morning appointments. Charlie is very energetic.",
      status: "active",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "(555) 987-6543",
      pets: [{ name: "Whiskers", species: "Cat", breed: "Maine Coon", photo: null }],
      totalBookings: 8,
      lastBooking: "2024-01-08",
      notes: "Cat is shy with new people. Needs gentle approach.",
      status: "active",
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma@example.com",
      phone: "(555) 456-7890",
      pets: [
        { name: "Rocky", species: "Dog", breed: "German Shepherd", photo: null },
        { name: "Luna", species: "Dog", breed: "Border Collie", photo: null },
      ],
      totalBookings: 15,
      lastBooking: "2024-01-12",
      notes: "Both dogs are well-trained. Rocky has hip issues.",
      status: "active",
    },
  ]

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.pets.some((pet) => pet.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Clients & Pets
        </h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients or pets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[300px] pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className={`cursor-pointer transition-colors ${
                selectedClient?.id === client.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedClient(client)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{client.name}</CardTitle>
                  <Badge variant="secondary">{client.totalBookings} bookings</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pets:</p>
                    <div className="flex flex-wrap gap-2">
                      {client.pets.map((pet, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">{pet.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-xs font-medium">{pet.name}</p>
                            <p className="text-xs text-muted-foreground">{pet.breed}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last booking: {new Date(client.lastBooking).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Client Details Panel */}
        <div>
          {selectedClient ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedClient.name}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>{selectedClient.email}</p>
                    <p>{selectedClient.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Pets</h4>
                  <div className="space-y-2">
                    {selectedClient.pets.map((pet: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="font-medium">{pet.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{pet.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {pet.breed} • {pet.species}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <Textarea value={selectedClient.notes} placeholder="Add notes about this client..." rows={3} />
                  <Button size="sm" className="mt-2">
                    Save Notes
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Booking History</h4>
                  <div className="text-sm space-y-1">
                    <p>Total bookings: {selectedClient.totalBookings}</p>
                    <p>Last booking: {new Date(selectedClient.lastBooking).toLocaleDateString()}</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      View Full History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a client to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
