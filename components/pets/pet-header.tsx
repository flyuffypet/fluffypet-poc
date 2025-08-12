"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export default function PetHeader({
  pet,
}: {
  pet: {
    id: string
    name: string
    species?: string | null
    breed?: string | null
    dob?: string | null
    color?: string | null
    status?: string | null
    photo_url?: string | null
  }
}) {
  const cover = pet.photo_url || "/placeholder.svg?height=280&width=600"
  const age = pet.dob ? Math.floor((Date.now() - new Date(pet.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null

  return (
    <div className="rounded-xl border overflow-hidden">
      <div className="relative h-40 w-full bg-muted">
        <Image
          src={cover || "/placeholder.svg"}
          alt={`${pet.name} cover`}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="flex items-center justify-between p-3">
        <div className="min-w-0">
          <div className="text-xl font-semibold truncate">{pet.name}</div>
          <div className="text-xs text-muted-foreground">
            {[pet.species, pet.breed].filter(Boolean).join(" • ") || "Pet"}
            {age !== null && ` • ${age}y`}
            {pet.color && ` • ${pet.color}`}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {pet.status && <Badge className="capitalize">{pet.status}</Badge>}
        </div>
      </div>
    </div>
  )
}
