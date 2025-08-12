"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Pill, Camera, Save, Clock } from "lucide-react"

export function VetVisitWorkspace() {
  const [soapNote, setSoapNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  })

  const [vitals, setVitals] = useState({
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
    weight: "",
    bloodPressure: "",
  })

  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      medication: "Amoxicillin",
      dosage: "250mg",
      frequency: "Twice daily",
      duration: "10 days",
      instructions: "Give with food",
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Visit Workspace</h2>
          <p className="text-sm text-muted-foreground">Current Patient: Buddy - Sarah Wilson</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Auto-saved 2 min ago
          </Badge>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save & Complete Visit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOAP Notes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                SOAP Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="subjective" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="subjective">Subjective</TabsTrigger>
                  <TabsTrigger value="objective">Objective</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="plan">Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="subjective" className="space-y-3">
                  <Label htmlFor="subjective">Chief Complaint & History</Label>
                  <Textarea
                    id="subjective"
                    placeholder="Owner reports that Buddy has been limping on his right front paw for 3 days..."
                    value={soapNote.subjective}
                    onChange={(e) => setSoapNote({ ...soapNote, subjective: e.target.value })}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="objective" className="space-y-3">
                  <Label htmlFor="objective">Physical Examination Findings</Label>
                  <Textarea
                    id="objective"
                    placeholder="Physical exam reveals swelling and tenderness in the right carpus..."
                    value={soapNote.objective}
                    onChange={(e) => setSoapNote({ ...soapNote, objective: e.target.value })}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="assessment" className="space-y-3">
                  <Label htmlFor="assessment">Diagnosis & Assessment</Label>
                  <Textarea
                    id="assessment"
                    placeholder="Likely soft tissue injury to right front paw, possibly sprain..."
                    value={soapNote.assessment}
                    onChange={(e) => setSoapNote({ ...soapNote, assessment: e.target.value })}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="plan" className="space-y-3">
                  <Label htmlFor="plan">Treatment Plan</Label>
                  <Textarea
                    id="plan"
                    placeholder="1. Rest and restricted activity for 7-10 days\n2. Anti-inflammatory medication\n3. Recheck in 1 week..."
                    value={soapNote.plan}
                    onChange={(e) => setSoapNote({ ...soapNote, plan: e.target.value })}
                    rows={6}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Vitals & Prescriptions */}
        <div className="space-y-6">
          {/* Vitals Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Vitals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="temp">Temp (°F)</Label>
                  <Input
                    id="temp"
                    value={vitals.temperature}
                    onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                    placeholder="101.5"
                  />
                </div>
                <div>
                  <Label htmlFor="hr">HR (bpm)</Label>
                  <Input
                    id="hr"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                    placeholder="120"
                  />
                </div>
                <div>
                  <Label htmlFor="rr">RR</Label>
                  <Input
                    id="rr"
                    value={vitals.respiratoryRate}
                    onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                    placeholder="24"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    placeholder="45.2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bp">Blood Pressure</Label>
                <Input
                  id="bp"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                  placeholder="120/80"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prescription Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{rx.medication}</h4>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Edit
                    </Button>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Dosage:</span> {rx.dosage}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Frequency:</span> {rx.frequency}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Duration:</span> {rx.duration}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Instructions:</span> {rx.instructions}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                <Pill className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
            </CardContent>
          </Card>

          {/* Attach Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Attach Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">Add photos, X-rays, or documents</p>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Upload Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
