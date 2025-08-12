"use client"

import { BellRing } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Reminder = {
  id: string
  user_id: string
  pet_id?: string | null
  title: string
  due_on: string
  done?: boolean | null
}

export function ReminderPillList({ items = [] as Reminder[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="h-5 w-5" />
          Reminders (soon)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">None due.</div>
        ) : (
          items.map((r) => (
            <Badge key={r.id} variant="secondary" className="text-xs">
              {r.title} • {new Date(r.due_on).toLocaleDateString()}
            </Badge>
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default ReminderPillList
