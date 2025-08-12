"use client"

import { Badge } from "@/components/ui/badge"

export default function InsightMiniList({
  items,
}: {
  items: { id: string; title?: string | null; severity?: string | null }[]
}) {
  if (!items?.length) return null
  return (
    <div className="space-y-1">
      {items.map((i) => (
        <div key={i.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
          <span className="truncate">{i.title || "Insight"}</span>
          {i.severity && <Badge className="capitalize">{i.severity}</Badge>}
        </div>
      ))}
    </div>
  )
}
