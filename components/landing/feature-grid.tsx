"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PawPrint, MessageSquareText, MapPin, Building2, ShieldCheck, UploadCloud } from "lucide-react"

const features = [
  {
    title: "Pet Profiles + Medical",
    icon: PawPrint,
    points: [
      "Immutable profile, owner-controlled sharing",
      "Vaccines, allergies, meds, notes (JSON)",
      "Snapshot sharing per appointment",
    ],
  },
  {
    title: "Secure Media",
    icon: UploadCloud,
    points: ["Uploads to Vercel Blob", "Private by default, signed URLs only", "Link to pet and booking records"],
  },
  {
    title: "Booking & Real-time Chat",
    icon: MessageSquareText,
    points: ["Instant status updates", "Contextual chat per booking", "Notifications and audit trail"],
  },
  {
    title: "Location-aware Discovery",
    icon: MapPin,
    points: ["Google Maps for search & routing", "Place IDs and coordinates stored", "Geo-driven recommendations"],
  },
  {
    title: "Multi-tenant Orgs & Roles",
    icon: Building2,
    points: ["Org admins, vets, staff, providers", "Invites & membership management", "Row Level Security enforcement"],
  },
  {
    title: "Privacy & Compliance",
    icon: ShieldCheck,
    points: ["UUIDs, strict RLS, signed URLs", "Permissioned data sharing", "Audit logs and data export/delete"],
  },
]

export default function FeatureGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {features.map((f) => {
        const Icon = f.icon
        return (
          <Card key={f.title} className="h-full">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              {f.title === "Privacy & Compliance" && (
                <div className="pt-1">
                  <Badge variant="secondary" className="text-xs">
                    Privacy-first
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
