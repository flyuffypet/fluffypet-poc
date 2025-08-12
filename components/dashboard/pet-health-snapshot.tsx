"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AllergyChips from "@/components/pets/allergy-chips"
import ConditionBadges from "@/components/pet/primitives/condition-badges"
import HealthScoreMini from "@/components/pet/primitives/health-score-mini"

export default function PetHealthSnapshot({
  vitals,
  allergies,
  conditions,
  healthScore,
}: {
  vitals?: { weight_kg?: number | null; temperature_c?: number | null; heart_rate_bpm?: number | null } | null
  allergies?: string[] | null
  conditions?: string[] | null
  healthScore?: number | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Health snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border p-2 text-center">
            <div className="text-xs text-muted-foreground">Weight</div>
            <div className="text-sm font-semibold">{vitals?.weight_kg ? `${vitals.weight_kg} kg` : "—"}</div>
          </div>
          <div className="rounded-lg border p-2 text-center">
            <div className="text-xs text-muted-foreground">Temp</div>
            <div className="text-sm font-semibold">{vitals?.temperature_c ? `${vitals.temperature_c} °C` : "—"}</div>
          </div>
          <div className="rounded-lg border p-2 text-center">
            <div className="text-xs text-muted-foreground">Heart</div>
            <div className="text-sm font-semibold">{vitals?.heart_rate_bpm ? `${vitals.heart_rate_bpm} bpm` : "—"}</div>
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Allergies</div>
          <AllergyChips items={allergies || []} />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Conditions</div>
          <ConditionBadges items={conditions || []} />
        </div>
        <HealthScoreMini score={healthScore ?? null} />
      </CardContent>
    </Card>
  )
}
