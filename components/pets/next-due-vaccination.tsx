"use client"

import { Badge } from "@/components/ui/badge"
import { Syringe } from "lucide-react"

export default function NextDueVaccination({
  item,
}: {
  item?: { vaccine_name: string; due_on?: string | null } | null
}) {
  if (!item) return null
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Syringe className="h-4 w-4" />
        Next vaccination
      </div>
      <div className="mt-1 text-sm">
        {item.vaccine_name}{" "}
        {item.due_on ? <Badge className="ml-2">{new Date(item.due_on).toLocaleDateString()}</Badge> : null}
      </div>
    </div>
  )
}
