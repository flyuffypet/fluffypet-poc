"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up as a pet owner or organization/provider. Invite teammates when ready.",
  },
  {
    n: "02",
    title: "Add pets & medical",
    body: "Create profiles, upload documents and scans, and set privacy preferences.",
  },
  {
    n: "03",
    title: "Discover & book",
    body: "Find providers by location, share a snapshot of records, and confirm appointments.",
  },
  {
    n: "04",
    title: "Chat & follow-up",
    body: "Chat within the booking, complete the visit, and keep an auditable history.",
  },
]

export default function HowItWorks() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">How FluffyPet works</h2>
        <p className="text-sm text-muted-foreground">
          From onboarding to appointments—permissioned and real-time end to end.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((s) => (
          <Card key={s.n} className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground">{s.n}</span>
                <span className="text-base">{s.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{s.body}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
