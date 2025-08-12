"use client"

import { Badge } from "@/components/ui/badge"

export default function AllergyChips({ items }: { items?: string[] | null }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((a, i) => (
        <Badge key={`${a}-${i}`} variant="destructive" className="text-xs">
          {a}
        </Badge>
      ))}
    </div>
  )
}
