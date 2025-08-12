"use client"

import { HeartPulse, ThermometerSun, Weight } from "lucide-react"

export default function VitalsMini({
  vitals,
}: {
  vitals?: { weight_kg?: number | null; temperature_c?: number | null; heart_rate_bpm?: number | null } | null
}) {
  if (!vitals) return null
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-lg border p-2 text-center">
        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Weight className="h-3.5 w-3.5" /> Weight
        </div>
        <div className="text-sm font-semibold">{vitals.weight_kg ? `${vitals.weight_kg} kg` : "—"}</div>
      </div>
      <div className="rounded-lg border p-2 text-center">
        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <ThermometerSun className="h-3.5 w-3.5" /> Temp
        </div>
        <div className="text-sm font-semibold">{vitals.temperature_c ? `${vitals.temperature_c} °C` : "—"}</div>
      </div>
      <div className="rounded-lg border p-2 text-center">
        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <HeartPulse className="h-3.5 w-3.5" /> Heart
        </div>
        <div className="text-sm font-semibold">{vitals.heart_rate_bpm ? `${vitals.heart_rate_bpm} bpm` : "—"}</div>
      </div>
    </div>
  )
}
