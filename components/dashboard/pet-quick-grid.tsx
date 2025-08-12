"use client"

import PetQuickCard from "@/components/dashboard/pet-quick-card"
import { Skeleton } from "@/components/ui/skeleton"

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

export function PetQuickGrid({
  pets,
  onSelect,
  selectedId,
  loading = false,
}: {
  pets: PetRow[]
  onSelect: (id: string) => void
  selectedId?: string | null
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!pets.length) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        No pets yet. Create one from the Pets page.
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {pets.map((p) => (
        <PetQuickCard key={p.id} pet={p} isSelected={selectedId === p.id} onSelect={() => onSelect(p.id)} />
      ))}
    </div>
  )
}
