"use client"

import { Syringe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface VaccinationDuePanelProps {
  userId?: string
}

export function VaccinationDuePanel({ userId }: VaccinationDuePanelProps) {
  const vaccinationsDue = [
    {
      id: "1",
      petName: "Buddy",
      vaccineName: "Rabies",
      dueDate: "2024-01-15",
      isOverdue: false,
    },
    {
      id: "2",
      petName: "Luna",
      vaccineName: "DHPP",
      dueDate: "2024-01-10",
      isOverdue: true,
    },
  ]

  if (vaccinationsDue.length === 0) {
    return (
      <div className="text-center py-4">
        <Syringe className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">All vaccinations are up to date!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {vaccinationsDue.map((vaccination) => (
        <div key={vaccination.id} className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <Syringe className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium text-sm">{vaccination.petName}</p>
              <p className="text-xs text-muted-foreground">{vaccination.vaccineName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Due</p>
              <p className="text-xs font-medium">{new Date(vaccination.dueDate).toLocaleDateString()}</p>
            </div>
            <Badge variant={vaccination.isOverdue ? "destructive" : "secondary"}>
              {vaccination.isOverdue ? "Overdue" : "Due Soon"}
            </Badge>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full bg-transparent">
        Schedule Vaccinations
      </Button>
    </div>
  )
}
