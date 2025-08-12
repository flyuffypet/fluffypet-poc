"use client"

import { Badge } from "@/components/ui/badge"

export default function StatusChip({ status }: { status?: string | null }) {
  if (!status) return null
  const s = (status || "").toLowerCase()
  let variant: "default" | "secondary" | "destructive" = "secondary"
  if (s === "active") variant = "secondary"
  if (s === "archived") variant = "default"
  if (s === "lost" || s === "deceased") variant = "destructive"
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  )
}
