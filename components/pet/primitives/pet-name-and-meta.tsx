"use client"

import { cn } from "@/lib/utils"

export default function PetNameAndMeta({
  name,
  species,
  breed,
  dob,
  className,
}: {
  name: string
  species?: string | null
  breed?: string | null
  dob?: string | null
  className?: string
}) {
  const age = dob ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null
  return (
    <div className={cn("min-w-0", className)}>
      <div className="truncate font-medium">{name}</div>
      <div className="text-xs text-muted-foreground truncate">
        {[species, breed].filter(Boolean).join(" • ") || "Pet"}
        {age !== null ? ` • ${age}y` : ""}
      </div>
    </div>
  )
}
