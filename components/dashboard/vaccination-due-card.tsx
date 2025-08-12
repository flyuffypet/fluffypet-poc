"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NextDueBadge from "@/components/pet/primitives/next-due-badge"

export default function VaccinationDueCard({
  item,
}: {
  item?: { vaccine_name: string; due_on?: string | null } | null
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Vaccination</CardTitle>
      </CardHeader>
      <CardContent>
        {item ? (
          <NextDueBadge label={item.vaccine_name} date={item.due_on || undefined} />
        ) : (
          <div className="text-sm text-muted-foreground">No upcoming vaccines.</div>
        )}
      </CardContent>
    </Card>
  )
}
