"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, User, Heart, AlertTriangle, Calendar, FileText } from "lucide-react"

export function VetPatients() {
  const [selectedPatient, setSelectedPatient] = useState<number | null>(1)
  const [searchQuery, setSearchQuery] = useState("")

  const mockPatients = [
    {
      id: 1,
      name: "Buddy",
      species: "Dog",
      breed: "Golden Retriever",
      age: "3 years",
      owner: "Sarah Wilson",
      lastVisit: "2024-01-10",
      allergies: ["Chicken", "Beef"],
      conditions: ["Hip Dysplasia"],
      weight: "32 kg",
      microchip: "123456789012345",
    },
    {
      id: 2,
      name: "Luna",
      species: "Cat",
      breed: "Persian",
      age: "5 years",
      owner: "Mike Chen",
      lastVisit: "2024-01-08",
      allergies: ["Fish"],
      conditions: ["Diabetes"],
      weight: "4.2 kg",
      microchip: "987654321098765",
    },
    {
      id: 3,
      name: "Max",
      species: "Dog",
      breed: "German Shepherd",
      age: "7 years",
      owner: "Emma Davis",
      lastVisit: "2024-01-05",
      allergies: [],
      conditions: ["Arthritis", "Heart Murmur"],
      weight: "35 kg",
      microchip: "456789123456789",
    },
  ]

  const mockHistory = [
    {
      id: 1,
      date: "2024-01-10",
      type: "Checkup",
      vet: "Dr. Smith",
      diagnosis: "Routine wellness exam",
      treatment: "Vaccinations updated",
      notes: "Patient in good health, slight weight gain noted",
    },
    {
      id: 2,
      date: "2023-12-15",
      type: "Surgery",
      vet: "Dr. Johnson",
      diagnosis: "Hip dysplasia",
      treatment: "Hip replacement surgery",
      notes: "Surgery successful, recovery going well",
    },
    {
      id: 3,
      date: "2023-11-20",
      type: "Emergency",
      vet: "Dr. Brown",
      diagnosis: "Gastric torsion",
      treatment: "Emergency surgery",
      notes: "Patient recovered fully, dietary recommendations provided",
    },
  ]

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.species.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedPatientData = mockPatients.find((p) => p.id === selectedPatient)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Patient Search & List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patients
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2 p-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedPatient === patient.id
                      ? "bg-primary/10 border-primary border"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {patient.species} • {patient.breed}
                      </p>
                      <p className="text-xs text-muted-foreground">{patient.owner}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Last visit</p>
                      <p className="text-sm">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {(patient.allergies.length > 0 || patient.conditions.length > 0) && (
                    <div className="flex gap-1 mt-2">
                      {patient.allergies.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Allergies
                        </Badge>
                      )}
                      {patient.conditions.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Conditions
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Patient Details & History */}
      <div className="lg:col-span-2 space-y-6">
        {selectedPatientData ? (
          <>
            {/* Patient Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedPatientData.name}</span>
                  <Button variant="outline" size="sm">
                    Edit Patient
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Species</p>
                    <p className="text-sm text-muted-foreground">{selectedPatientData.species}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Breed</p>
                    <p className="text-sm text-muted-foreground">{selectedPatientData.breed}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Age</p>
                    <p className="text-sm text-muted-foreground">{selectedPatientData.age}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Weight</p>
                    <p className="text-sm text-muted-foreground">{selectedPatientData.weight}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Owner</p>
                    <p className="text-sm text-muted-foreground">{selectedPatientData.owner}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Microchip</p>
                    <p className="text-sm text-muted-foreground font-mono">{selectedPatientData.microchip}</p>
                  </div>

                  {selectedPatientData.allergies.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        Allergies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatientData.allergies.map((allergy) => (
                          <Badge key={allergy} variant="destructive">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPatientData.conditions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-orange-500" />
                        Medical Conditions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatientData.conditions.map((condition) => (
                          <Badge key={condition} variant="secondary">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* History Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {mockHistory.map((record, index) => (
                      <div key={record.id} className="relative">
                        {index !== mockHistory.length - 1 && (
                          <div className="absolute left-4 top-8 w-px h-full bg-border" />
                        )}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{record.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(record.date).toLocaleDateString()}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">Dr. {record.vet}</p>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Treatment:</span> {record.treatment}
                              </p>
                              {record.notes && (
                                <p className="text-sm">
                                  <span className="font-medium">Notes:</span> {record.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Select a Patient</h3>
                <p className="text-muted-foreground">Choose a patient from the list to view their details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
