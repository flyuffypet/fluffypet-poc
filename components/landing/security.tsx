"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, FileCheck2, KeyRound, Hash, ScrollText } from "lucide-react"

const items = [
  { icon: Hash, text: "Non-sequential UUIDs for all core entities" },
  { icon: KeyRound, text: "Strict Row Level Security (RLS) across tables" },
  { icon: FileCheck2, text: "Signed URLs for all media access" },
  { icon: ScrollText, text: "Comprehensive audit trails for sensitive actions" },
  { icon: ShieldCheck, text: "Owner-controlled granular sharing per appointment/org" },
]

export default function Security() {
  return (
    <section className="rounded-xl border bg-card">
      <div className="p-6 md:p-8">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Privacy & Security by design
        </CardTitle>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((i) => {
            const Icon = i.icon
            return (
              <Card key={i.text} className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{i.text}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {/* Intentionally concise; details in docs/dashboard */}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
