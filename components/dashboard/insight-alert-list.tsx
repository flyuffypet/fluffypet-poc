"use client"

import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Insight = {
  id: string
  user_id: string
  pet_id?: string | null
  title?: string | null
  description?: string | null
  severity?: "low" | "medium" | "high" | null
  is_acknowledged: boolean
  created_at: string
}

function severityBadge(sev?: Insight["severity"]) {
  switch (sev) {
    case "high":
      return <Badge variant="destructive">High</Badge>
    case "medium":
      return <Badge>Medium</Badge>
    case "low":
      return <Badge variant="secondary">Low</Badge>
    default:
      return null
  }
}

export function InsightAlertList({ items = [] as Insight[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No new insights.</div>
        ) : (
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.id} className="rounded-md border p-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{i.title || "Insight"}</span>
                  {severityBadge(i.severity)}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(i.created_at).toLocaleDateString()}
                  </span>
                </div>
                {i.description && <div className="text-xs text-muted-foreground">{i.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default InsightAlertList
