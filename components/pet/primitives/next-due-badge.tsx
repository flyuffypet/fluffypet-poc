"use client"

import { Badge } from "@/components/ui/badge"
import { Syringe } from "lucide-react"

export default function NextDueBadge({
  label,
  date,
}: {
  label?: string | null
  date?: string | null
}) {
  if (!label && !date) return null
  return (
    <div className="flex items-center gap-1 text-xs">
      <Syringe className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-muted-foreground">Next due:</span>
      <Badge className="ml-1">
        {label || "Vaccine"}
        {date ? ` • ${new Date(date).toLocaleDateString()}` : ""}
      </Badge>
    </div>
  )
}
