"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PawPrint, Syringe, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Pet, UserRole } from "./types"
import { filterPetForRole } from "./pet-utils"

type PetCardProps = {
  pet?: Pet
  role?: UserRole
  className?: string
  onClick?: () => void
}

const defaultPet: Pet = {
  id: "pet_demo_1",
  name: "Milo",
  species: "Dog",
  breed: "Labrador Retriever",
  sex: "male",
  ageYears: 3,
  weightKg: 28,
  avatarUrl: "/placeholder.svg?height=128&width=128",
  medical: {
    vaccines: [
      { name: "Rabies", status: "complete", date: "2024-05-01" },
      { name: "DHPP", status: "due", due: "2025-05-01" },
    ],
  },
}

export default function PetCard({ pet = defaultPet, role = "owner", className, onClick }: PetCardProps) {
  const view = filterPetForRole(pet, role)

  const vaccineSummary = view.medical?.vaccines?.reduce(
    (acc, v) => {
      if (v.status === "complete") acc.complete++
      else if (v.status === "due") acc.due++
      else if (v.status === "overdue") acc.overdue++
      return acc
    },
    { complete: 0, due: 0, overdue: 0 },
  )

  return (
    <Card className={cn("overflow-hidden", className)} onClick={onClick} role={onClick ? "button" : undefined}>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-ring/40">
          <Image
            src={view.avatarUrl || "/placeholder.svg?height=128&width=128&query=pet+avatar"}
            alt={`${view.name} avatar`}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
        <div className="min-w-0">
          <CardTitle className="truncate text-base">{view.name}</CardTitle>
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <PawPrint className="h-3.5 w-3.5" />
            <span>{[view.species, view.breed].filter(Boolean).join(" • ") || "Pet"}</span>
            {typeof view.ageYears === "number" && <span>• {view.ageYears}y</span>}
            {typeof view.weightKg === "number" && <span>• {view.weightKg}kg</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {vaccineSummary && (
          <div className="flex items-center gap-2">
            <Syringe className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                Complete {vaccineSummary.complete}
              </Badge>
              <Badge className="text-xs">Due {vaccineSummary.due}</Badge>
              <Badge variant="destructive" className="text-xs">
                Overdue {vaccineSummary.overdue}
              </Badge>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span className="truncate">Role-based view: {role}</span>
        </div>
      </CardContent>
    </Card>
  )
}
