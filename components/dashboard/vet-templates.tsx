"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Pill, Stethoscope, Search, Plus, Star } from "lucide-react"

export function VetTemplates() {
  const [searchQuery, setSearchQuery] = useState("")

  const mockSOAPTemplates = [
    {
      id: 1,
      name: "Routine Wellness Exam",
      category: "Preventive",
      usage: 45,
      isFavorite: true,
      template: {
        subjective: "Owner reports pet is eating, drinking, and eliminating normally. No concerns noted.",
        objective: "BAR, good body condition. TPR within normal limits. No abnormalities on physical exam.",
        assessment: "Healthy adult [species] presenting for routine wellness examination.",
        plan: "Continue current diet and exercise routine. Return in 12 months for next wellness exam.",
      },
    },
    {
      id: 2,
      name: "Dental Cleaning",
      category: "Dental",
      usage: 23,
      isFavorite: false,
      template: {
        subjective: "Owner reports bad breath and tartar buildup. Pet eating normally.",
        objective: "Grade [X] dental disease noted. Tartar and plaque present on [teeth]. Gums [condition].",
        assessment: "Dental disease requiring professional cleaning and [extractions if needed].",
        plan: "Pre-anesthetic bloodwork, dental cleaning under anesthesia, post-op pain management.",
      },
    },
    {
      id: 3,
      name: "Skin Allergy",
      category: "Dermatology",
      usage: 18,
      isFavorite: true,
      template: {
        subjective: "Owner reports itching, scratching, and [skin changes]. Duration: [timeframe].",
        objective: "Skin examination reveals [lesions/erythema/etc]. Distribution: [areas affected].",
        assessment: "Allergic dermatitis, likely [environmental/food/flea] allergy.",
        plan: "Allergy testing, elimination diet trial, symptomatic treatment with [medications].",
      },
    },
  ]

  const mockOrderSets = [
    {
      id: 1,
      name: "Pre-Surgical Bloodwork",
      category: "Surgery",
      usage: 67,
      isFavorite: true,
      items: ["CBC", "Chemistry Panel", "Electrolytes", "Coagulation Panel"],
    },
    {
      id: 2,
      name: "Diabetes Monitoring",
      category: "Endocrine",
      usage: 34,
      isFavorite: false,
      items: ["Glucose Curve", "Fructosamine", "Urinalysis", "Urine Culture"],
    },
    {
      id: 3,
      name: "Cardiac Workup",
      category: "Cardiology",
      usage: 28,
      isFavorite: true,
      items: ["Chest X-rays", "ECG", "Echocardiogram", "Pro-BNP", "CBC", "Chemistry"],
    },
  ]

  const mockRxFavorites = [
    {
      id: 1,
      medication: "Carprofen",
      strength: "75mg",
      form: "Tablets",
      usage: 89,
      isFavorite: true,
      commonDose: "2mg/kg BID",
      indication: "Pain/Inflammation",
    },
    {
      id: 2,
      medication: "Amoxicillin",
      strength: "250mg",
      form: "Capsules",
      usage: 76,
      isFavorite: true,
      commonDose: "10-20mg/kg BID",
      indication: "Bacterial infections",
    },
    {
      id: 3,
      medication: "Prednisolone",
      strength: "5mg",
      form: "Tablets",
      usage: 54,
      isFavorite: false,
      commonDose: "0.5-2mg/kg BID",
      indication: "Inflammation/Allergies",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Templates & Favorites
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="w-[200px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="soap" className="space-y-4">
        <TabsList>
          <TabsTrigger value="soap">SOAP Templates</TabsTrigger>
          <TabsTrigger value="orders">Order Sets</TabsTrigger>
          <TabsTrigger value="rx">Rx Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="soap" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template List */}
            <Card>
              <CardHeader>
                <CardTitle>SOAP Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockSOAPTemplates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center gap-2">
                          {template.name}
                          {template.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </h4>
                        <Badge variant="secondary">{template.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Used {template.usage} times</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Subjective</h4>
                  <Textarea value={mockSOAPTemplates[0].template.subjective} readOnly className="min-h-[60px]" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Objective</h4>
                  <Textarea value={mockSOAPTemplates[0].template.objective} readOnly className="min-h-[60px]" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Assessment</h4>
                  <Textarea value={mockSOAPTemplates[0].template.assessment} readOnly className="min-h-[60px]" />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Plan</h4>
                  <Textarea value={mockSOAPTemplates[0].template.plan} readOnly className="min-h-[60px]" />
                </div>
                <div className="flex gap-2">
                  <Button>Use Template</Button>
                  <Button variant="outline">Edit</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockOrderSets.map((orderSet) => (
              <Card key={orderSet.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      {orderSet.name}
                    </span>
                    {orderSet.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {orderSet.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Used {orderSet.usage} times</p>
                    <div>
                      <h5 className="font-medium mb-2">Includes:</h5>
                      <ul className="text-sm space-y-1">
                        {orderSet.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Use Order Set</Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rx" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRxFavorites.map((rx) => (
              <Card key={rx.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      {rx.medication}
                    </span>
                    {rx.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Strength:</span> {rx.strength}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Form:</span> {rx.form}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Common Dose:</span> {rx.commonDose}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Indication:</span> {rx.indication}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">Used {rx.usage} times</p>
                    <div className="flex gap-2">
                      <Button size="sm">Prescribe</Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
