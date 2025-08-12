"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Syringe, Search, Calendar, AlertTriangle } from "lucide-react"

export function VetVaccinesDue() {
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([])

  const mockVaccinesDue = [
    {
      id: 1,
      patient: "Buddy",
      owner: "Sarah Wilson",
      species: "Dog",
      vaccine: "DHPP",
      dueDate: "2024-01-15",
      lastGiven: "2023-01-15",
      isOverdue: false,
      priority: "routine",
    },
    {
      id: 2,
      patient: "Luna",
      owner: "Mike Chen",
      species: "Cat",
      vaccine: "FVRCP",
      dueDate: "2024-01-10",
      lastGiven: "2023-01-10",
      isOverdue: true,
      priority: "urgent",
    },
    {
      id: 3,
      patient: "Max",
      owner: "Emma Davis",
      species: "Dog",
      vaccine: "Rabies",
      dueDate: "2024-01-20",
      lastGiven: "2021-01-20",
      isOverdue: false,
      priority: "routine",
    },
    {
      id: 4,
      patient: "Charlie",
      owner: "John Smith",
      species: "Dog",
      vaccine: "Bordetella",
      dueDate: "2024-01-08",
      lastGiven: "2023-07-08",
      isOverdue: true,
      priority: "urgent",
    },
  ]

  const handleVaccineSelect = (vaccineId: string) => {
    setSelectedVaccines((prev) =>
      prev.includes(vaccineId) ? prev.filter((id) => id !== vaccineId) : [...prev, vaccineId],
    )
  }

  const getPriorityColor = (priority: string, isOverdue: boolean) => {
    if (isOverdue) return "destructive"
    return priority === "urgent" ? "default" : "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Syringe className="h-5 w-5" />
          Vaccines Due
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="w-[200px] pl-8" />
          </div>
          <Button disabled={selectedVaccines.length === 0}>Mark {selectedVaccines.length} as Given</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <Syringe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockVaccinesDue.length}</div>
            <p className="text-xs text-muted-foreground">Vaccines due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockVaccinesDue.filter((v) => v.isOverdue).length}
            </div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockVaccinesDue.filter((v) => {
                  const dueDate = new Date(v.dueDate)
                  const weekFromNow = new Date()
                  weekFromNow.setDate(weekFromNow.getDate() + 7)
                  return dueDate <= weekFromNow && !v.isOverdue
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Due within 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dogs vs Cats</CardTitle>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockVaccinesDue.filter((v) => v.species === "Dog").length}/
              {mockVaccinesDue.filter((v) => v.species === "Cat").length}
            </div>
            <p className="text-xs text-muted-foreground">Dogs / Cats</p>
          </CardContent>
        </Card>
      </div>

      {/* Vaccines Due List */}
      <Card>
        <CardHeader>
          <CardTitle>Vaccines Due List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockVaccinesDue.map((vaccine) => (
              <div key={vaccine.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedVaccines.includes(vaccine.id.toString())}
                    onCheckedChange={() => handleVaccineSelect(vaccine.id.toString())}
                  />
                  <div>
                    <h4 className="font-medium">
                      {vaccine.patient} - {vaccine.owner}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {vaccine.species} • {vaccine.vaccine}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last given: {new Date(vaccine.lastGiven).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">Due: {new Date(vaccine.dueDate).toLocaleDateString()}</p>
                    <Badge variant={getPriorityColor(vaccine.priority, vaccine.isOverdue)}>
                      {vaccine.isOverdue ? "Overdue" : vaccine.priority}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Mark Given
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mark as Given Modal would appear here */}
      {selectedVaccines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Vaccines as Given</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date-given">Date Given</Label>
                <Input id="date-given" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <Label htmlFor="batch-number">Batch Number</Label>
                <Input id="batch-number" placeholder="Enter batch number" />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Additional notes..." />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setSelectedVaccines([])}>Mark {selectedVaccines.length} as Given</Button>
              <Button variant="outline" onClick={() => setSelectedVaccines([])}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
