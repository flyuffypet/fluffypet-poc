"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Media = {
  id: string
  pet_id: string
  type: string
  filename?: string | null
  path: string
  mime_type?: string | null
  created_at: string
}

export default function RecentMediaStrip({ items = [] as Media[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent uploads</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No recent media.</div>
        ) : (
          <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
            {items.map((m) => (
              <div key={m.id} className="overflow-hidden rounded-md border bg-muted">
                <Image
                  src={"/placeholder.svg?height=240&width=320&query=pet+media"}
                  alt={m.filename || "Media"}
                  width={320}
                  height={240}
                  className="h-20 w-full object-cover md:h-24"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
