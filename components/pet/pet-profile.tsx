"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Download, File, ImageIcon, Syringe, Stethoscope, ShieldBan, ShieldCheck } from "lucide-react"
import type { Pet, UserRole, PetMedia } from "./types"
import { filterPetForRole, roleLabel } from "./pet-utils"

type PetProfileProps = {
  pet?: Pet
  role?: UserRole
  // Optional: when true, tries to sign media URLs via /api/blob/sign
  signMedia?: boolean
}

const demoPet: Pet = {
  id: "pet_demo_1",
  name: "Milo",
  species: "Dog",
  breed: "Labrador Retriever",
  sex: "male",
  ageYears: 3,
  weightKg: 28,
  color: "Yellow",
  microchipId: "985141003938271",
  avatarUrl: "/placeholder.svg?height=200&width=200",
  medical: {
    vaccines: [
      { name: "Rabies", status: "complete", date: "2024-05-01" },
      { name: "DHPP", status: "due", due: "2025-05-01" },
    ],
    allergies: ["Chicken"],
    conditions: ["Hip dysplasia (mild)"],
    meds: [{ name: "Glucosamine", dose: "500mg", schedule: "Daily" }],
    notes: "Friendly with people; anxious at clinics.",
  },
  privacy: {
    shareWithProviders: true,
    sharedFields: ["species", "breed", "sex", "ageYears", "weightKg", "medical.vaccines", "medical.allergies", "media"],
  },
  media: [
    { url: "/placeholder.svg?height=600&width=800", name: "Outdoor.jpg", kind: "image" },
    { url: "/placeholder.svg?height=600&width=800", name: "Vaccination.pdf", kind: "document" },
  ],
}

async function signUrlIfNeeded(item: PetMedia, enabled: boolean): Promise<string> {
  if (!enabled) return item.url
  try {
    const res = await fetch("/api/blob/sign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        url: item.url, // original Blob URL or pointer
        // expiresIn could be set server-side; kept minimal here
      }),
    })
    if (!res.ok) throw new Error("sign failed")
    const data = await res.json()
    return data.url || item.url
  } catch {
    return item.url
  }
}

export default function PetProfile({ pet = demoPet, role = "owner", signMedia = true }: PetProfileProps) {
  const view = useMemo(() => filterPetForRole(pet, role), [pet, role])
  const [signedMedia, setSignedMedia] = useState<PetMedia[] | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const out: PetMedia[] = []
      for (const m of view.media ?? []) {
        const url = await signUrlIfNeeded(m, signMedia)
        out.push({ ...m, url })
      }
      if (!cancelled) setSignedMedia(out)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [view.media, signMedia])

  const isOwnerOrAdmin = role === "owner" || role === "admin"

  return (
    <Card className="w-full">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-ring/40">
            <Image
              src={view.avatarUrl || "/placeholder.svg?height=128&width=128&query=pet+avatar"}
              alt={`${view.name} avatar`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0">
            <CardTitle className="truncate text-xl">{view.name}</CardTitle>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span>{[view.species, view.breed].filter(Boolean).join(" • ") || "Pet"}</span>
              {typeof view.ageYears === "number" && <span>• {view.ageYears}y</span>}
              {typeof view.weightKg === "number" && <span>• {view.weightKg}kg</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary">{roleLabel(role)}</Badge>
          {view.privacy?.shareWithProviders ? (
            <Badge className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {"Share-enabled"}
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <ShieldBan className="h-3.5 w-3.5" />
              {"Share-restricted"}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
              {view.sex && (
                <div>
                  <span className="text-muted-foreground">{"Sex"}</span>
                  <div className="font-medium capitalize">{view.sex}</div>
                </div>
              )}
              {view.color && (
                <div>
                  <span className="text-muted-foreground">{"Color"}</span>
                  <div className="font-medium">{view.color}</div>
                </div>
              )}
              {view.microchipId && isOwnerOrAdmin && (
                <div>
                  <span className="text-muted-foreground">{"Microchip"}</span>
                  <div className="font-medium">{view.microchipId}</div>
                </div>
              )}
            </div>
            {isOwnerOrAdmin && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">{"Edit Profile"}</Button>
                  <Button size="sm" variant="secondary">
                    {"Upload Media"}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="medical" className="mt-3 space-y-4">
            {view.medical?.vaccines && view.medical.vaccines.length > 0 && (
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">{"Vaccinations"}</h3>
                </div>
                <div className="grid gap-2">
                  {view.medical.vaccines.map((v, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <div className="min-w-0">
                        <div className="font-medium">{v.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {v.date ? `Given: ${v.date}` : v.due ? `Due: ${v.due}` : "—"}
                        </div>
                      </div>
                      {v.status && (
                        <Badge
                          variant={
                            v.status === "overdue" ? "destructive" : v.status === "due" ? "default" : "secondary"
                          }
                          className="capitalize"
                        >
                          {v.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {view.medical?.allergies?.length || view.medical?.conditions?.length || view.medical?.meds?.length ? (
              <section className="space-y-3">
                {view.medical?.allergies && view.medical.allergies.length > 0 && (
                  <div className="text-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{"Allergies"}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {view.medical.allergies.map((a, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {view.medical?.conditions && view.medical.conditions.length > 0 && (
                  <div className="text-sm">
                    <div className="mb-1 text-sm font-semibold">{"Conditions"}</div>
                    <ul className="list-inside list-disc text-muted-foreground">
                      {view.medical.conditions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {view.medical?.meds && view.medical.meds.length > 0 && (
                  <div className="text-sm">
                    <div className="mb-1 text-sm font-semibold">{"Medications"}</div>
                    <ul className="list-inside list-disc text-muted-foreground">
                      {view.medical.meds.map((m, i) => (
                        <li key={i}>
                          <span className="font-medium text-foreground">{m.name}</span>
                          {["dose", "schedule"].some((k) => (m as any)[k]) && (
                            <span>{` — ${[m.dose, m.schedule].filter(Boolean).join(" • ")}`}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ) : (
              <p className="text-sm text-muted-foreground">{"No medical data available."}</p>
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-3">
            {signedMedia && signedMedia.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {signedMedia.map((m, i) => (
                  <a
                    key={`${m.url}-${i}`}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-md border p-2"
                  >
                    <div className="mb-2 flex h-24 items-center justify-center overflow-hidden rounded bg-muted">
                      {m.kind === "image" ? (
                        <ImageIcon className="h-6 w-6 text-muted-foreground group-hover:scale-110 transition-transform" />
                      ) : (
                        <File className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate">{m.name || "Media"}</span>
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{"No media available."}</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
