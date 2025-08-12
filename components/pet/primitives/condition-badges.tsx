"use client"

import { Badge } from "@/components/ui/badge"

export default function ConditionBadges({ items }: { items?: string[] | null }) {
  if (!items?.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((c, i) => (
        <Badge key={`${c}-${i}`} className="text-[11px] capitalize">
          {c}
        </Badge>
      ))}
    </div>
  )
}
