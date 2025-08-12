"use client"

import Link from "next/link"
import PetAvatar from "@/components/pet/primitives/pet-avatar"
import PetNameAndMeta from "@/components/pet/primitives/pet-name-and-meta"
import StatusChip from "@/components/pet/primitives/status-chip"
import LastUpdatedAt from "@/components/pet/primitives/last-updated-at"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

type PetRow = {
  id: string
  name: string
  species?: string | null
  breed?: string | null
  dob?: string | null
  status?: string | null
  photo_url?: string | null
  updated_at?: string | null
}

export default function PetQuickCard({
  pet,
  isSelected = false,
  onSelect,
}: {
  pet: PetRow
  isSelected?: boolean
  onSelect?: () => void
}) {
  return (
    <Card className={cn("overflow-hidden transition-colors hover:bg-muted/40", isSelected && "ring-2 ring-primary")}>
      <CardHeader className="flex flex-row items-center gap-3">
        <PetAvatar
          src={pet.photo_url || undefined}
          alt={`${pet.name} cover`}
          species={pet.species || undefined}
          size={56}
        />
        <div className="min-w-0 flex-1">
          <PetNameAndMeta
            name={pet.name}
            species={pet.species || undefined}
            breed={pet.breed || undefined}
            dob={pet.dob || undefined}
          />
          <div className="mt-1 flex items-center gap-2">
            <StatusChip status={pet.status || undefined} />
            <LastUpdatedAt updatedAt={pet.updated_at || undefined} />
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/pets/${pet.id}`}>View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSelect}>Add Record</DropdownMenuItem>
            <DropdownMenuItem onClick={onSelect}>Upload Media</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/pets/${pet.id}/sharing`}>Share Access</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSelect}>Book Visit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <Button variant="outline" className="bg-transparent" size="sm" onClick={onSelect}>
          {isSelected ? "Selected" : "Select"}
        </Button>
        <Button asChild size="sm">
          <Link href={`/pets/${pet.id}`}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
