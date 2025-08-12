"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export type PetListFilterState = {
  species?: string
  status?: string
  q?: string
}

export default function PetListFilters({
  onChange,
  initial,
}: {
  onChange: (state: PetListFilterState) => void
  initial?: PetListFilterState
}) {
  const [state, setState] = useState<PetListFilterState>(initial || {})

  function update<K extends keyof PetListFilterState>(key: K, value: PetListFilterState[K]) {
    const next = { ...state, [key]: value }
    setState(next)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        placeholder="Search name or breed..."
        value={state.q || ""}
        onChange={(e) => update("q", e.target.value)}
        className="sm:max-w-xs"
      />
      <Select value={state.species || "all"} onValueChange={(v) => update("species", v === "all" ? undefined : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Species" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All species</SelectItem>
          <SelectItem value="Dog">Dog</SelectItem>
          <SelectItem value="Cat">Cat</SelectItem>
          <SelectItem value="Bird">Bird</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
      <Select value={state.status || "active"} onValueChange={(v) => update("status", v === "all" ? undefined : v)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
          <SelectItem value="deceased">Deceased</SelectItem>
          <SelectItem value="lost">Lost</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
