"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stacks = [
  { name: "Supabase (Auth, Postgres, Realtime, RLS)", img: "/placeholder.svg?height=48&width=160" },
  { name: "Vercel Blob (Media)", img: "/placeholder.svg?height=48&width=160" },
  { name: "Google Maps (Geo)", img: "/placeholder.svg?height=48&width=160" },
  { name: "Upstash Redis (Profiles/AI)", img: "/placeholder.svg?height=48&width=160" },
  { name: "Vercel AI SDK (AI flows)", img: "/placeholder.svg?height=48&width=160" },
]

export default function Integrations() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Built with a modern stack</h2>
        <Badge variant="secondary" className="text-xs">
          Production-ready
        </Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {stacks.map((s) => (
          <Card key={s.name} className="overflow-hidden">
            <CardContent className="flex h-24 items-center justify-center p-3">
              <img src={s.img || "/placeholder.svg"} alt={s.name} className="h-10 w-auto opacity-80" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
