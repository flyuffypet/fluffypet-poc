"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { track } from "@vercel/analytics"
import { cn } from "@/lib/utils"

type Role = "admin" | "vet" | "provider" | "staff" | "volunteer"

const roleToVariant: Record<Role, "default" | "secondary" | "outline"> = {
  admin: "default",
  vet: "secondary",
  provider: "secondary",
  staff: "outline",
  volunteer: "outline",
}

function handleKeyPress(e: React.KeyboardEvent, onActivate: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault()
    onActivate()
  }
}

export default function RoleLegend() {
  const items: { label: string; role: Role }[] = [
    { label: "Admin", role: "admin" },
    { label: "Vet", role: "vet" },
    { label: "Provider", role: "provider" },
    { label: "Staff", role: "staff" },
    { label: "Volunteer", role: "volunteer" },
  ]

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-2 text-sm font-semibold">{"Role legend"}</h3>
      <p className="mb-3 text-xs text-muted-foreground">{"Badges indicate your role in the organization."}</p>
      <div className="flex flex-wrap items-center gap-3">
        {items.map((it) => {
          const variant = roleToVariant[it.role]
          return (
            <Badge
              key={it.role}
              variant={variant}
              className={cn("text-[11px] cursor-pointer select-none")}
              role="button"
              tabIndex={0}
              aria-label={`Role badge ${it.label}`}
              onClick={() => track("role_badge_click", { role: it.role })}
              onKeyDown={(e) => handleKeyPress(e, () => track("role_badge_click", { role: it.role }))}
              data-role={it.role}
            >
              {it.label}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
