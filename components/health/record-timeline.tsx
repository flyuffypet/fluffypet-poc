"use client"

import { Badge } from "@/components/ui/badge"

type Record = {
  id: string
  record_type: string
  data: any
  recorded_at: string
}

export default function RecordTimeline({ items = [] as Record[] }) {
  if (items.length === 0) {
    return <div className="text-sm text-muted-foreground">No health records yet.</div>
  }

  const byDate = items.reduce((acc: Record<string, Record[]>, r) => {
    const d = new Date(r.recorded_at).toDateString()
    acc[d] = acc[d] || []
    acc[d].push(r)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {Object.entries(byDate).map(([d, list]) => (
        <div key={d} className="space-y-2">
          <div className="text-xs font-semibold">{d}</div>
          <div className="space-y-2">
            {list.map((r) => (
              <div key={r.id} className="rounded-md border p-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {r.record_type}
                  </Badge>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(r.recorded_at).toLocaleTimeString()}
                  </span>
                </div>
                {r.data?.note && <div className="text-xs text-muted-foreground mt-1">{r.data.note}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
