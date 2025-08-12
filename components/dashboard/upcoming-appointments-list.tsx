"use client"

import { CalendarClock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Appt = {
  id: string
  pet_id: string
  scheduled_at: string
  status?: string | null
  organization_id?: string | null
}

export function UpcomingAppointmentsList({ items = [] as Appt[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-5 w-5" />
          Upcoming appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">None scheduled.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <div className="min-w-0">
                  <div className="font-medium">Appt {a.id.slice(0, 8)}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.scheduled_at).toLocaleString()} • {a.status || "scheduled"}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{a.organization_id?.slice(0, 8)}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default UpcomingAppointmentsList
