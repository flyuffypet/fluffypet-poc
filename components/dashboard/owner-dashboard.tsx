"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { PetQuickGrid } from "@/components/dashboard/pet-quick-grid"
import PetHealthSnapshot from "@/components/dashboard/pet-health-snapshot"
import VaccinationDueCard from "@/components/dashboard/vaccination-due-card"
import UpcomingAppointmentsList from "@/components/dashboard/upcoming-appointments-list"
import InsightAlertList from "@/components/dashboard/insight-alert-list"
import RecentMediaStrip from "@/components/dashboard/recent-media-strip"
import ReminderPillList from "@/components/dashboard/reminder-pill-list"
import AddRecordQuickModal from "@/components/modals/add-record-quick-modal"
import UploadMediaModal from "@/components/modals/upload-media-modal"
import SharePetModal from "@/components/modals/share-pet-modal"
import CreateAppointmentModal from "@/components/modals/create-appointment-modal"
import { useRealtimePet } from "@/hooks/use-realtime-pet"
import { Button } from "@/components/ui/button"

type PetRow = {
  id: string
  name: string
  species?: string | null
  breed?: string | null
  dob?: string | null
  status?: string | null
  photo_url?: string | null
  updated_at?: string | null
}

export default function OwnerDashboard({ initialPets }: { initialPets: PetRow[] }) {
  const supabase = getSupabaseBrowserClient()
  const [pets, setPets] = useState<PetRow[]>(initialPets)
  const [selectedId, setSelectedId] = useState<string | null>(initialPets[0]?.id || null)
  const [loading, setLoading] = useState(false)

  // Per-pet data
  const [vitals, setVitals] = useState<any | null>(null)
  const [allergies, setAllergies] = useState<string[]>([])
  const [conditions, setConditions] = useState<string[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [nextVaccine, setNextVaccine] = useState<{ vaccine_name: string; due_on?: string | null } | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])

  const selectedPet = useMemo(() => pets.find((p) => p.id === selectedId) || null, [pets, selectedId])

  const loadPerPet = useCallback(
    async (petId: string) => {
      setLoading(true)
      try {
        const { data: auth } = await supabase.auth.getUser()
        const user = auth.user

        const q1 = supabase
          .from("medical_records")
          .select("data")
          .eq("pet_id", petId)
          .eq("record_type", "vitals")
          .order("recorded_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        const q2 = supabase.from("allergies").select("allergen").eq("pet_id", petId).limit(10)
        const q3 = supabase.from("conditions").select("diagnosis").eq("pet_id", petId).limit(10)
        const q4 = supabase
          .from("ai_insights")
          .select("*")
          .eq("pet_id", petId)
          .eq("is_acknowledged", false)
          .order("created_at", { ascending: false })
          .limit(3)
        const q5 = supabase
          .from("vaccinations")
          .select("vaccine_name, due_on")
          .eq("pet_id", petId)
          .gt("due_on", new Date().toISOString())
          .order("due_on", { ascending: true })
          .limit(1)
          .maybeSingle()
        const q6 = supabase
          .from("appointments")
          .select("id, pet_id, scheduled_at, status, organization_id")
          .eq("pet_id", petId)
          .gt("scheduled_at", new Date().toISOString())
          .order("scheduled_at", { ascending: true })
          .limit(5)
        const q7 = supabase
          .from("pet_media")
          .select("id, pet_id, type, filename, path, mime_type, created_at")
          .eq("pet_id", petId)
          .order("created_at", { ascending: false })
          .limit(6)
        const q8 = supabase
          .from("reminders")
          .select("*")
          .eq("user_id", user?.id || "")
          .eq("pet_id", petId)
          .gt("due_on", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order("due_on", { ascending: true })
          .limit(6)

        const [
          { data: vitalsRec },
          { data: alg },
          { data: cond },
          { data: insightsRows },
          { data: nextVac },
          { data: appts },
          { data: mediaRows },
          { data: remRows },
        ] = await Promise.all([q1, q2, q3, q4, q5, q6, q7, q8])

        setVitals(vitalsRec?.data || null)
        setAllergies((alg || []).map((a: any) => a.allergen).filter(Boolean))
        setConditions((cond || []).map((c: any) => c.diagnosis).filter(Boolean))
        setInsights(insightsRows || [])
        setNextVaccine(nextVac || null)
        setAppointments(appts || [])
        setMedia(mediaRows || [])
        setReminders(remRows || [])
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

  useEffect(() => {
    if (selectedId) loadPerPet(selectedId)
  }, [selectedId, loadPerPet])

  useRealtimePet(selectedId || "", () => {
    if (selectedId) loadPerPet(selectedId)
  })

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">My Pets</h2>
            <p className="text-xs text-muted-foreground">Select a pet to view its snapshot and activity.</p>
          </div>
          {selectedPet ? (
            <div className="flex flex-wrap gap-2">
              <AddRecordQuickModal petId={selectedPet.id} onAdded={() => loadPerPet(selectedPet.id)} />
              <UploadMediaModal petId={selectedPet.id} onUploaded={() => loadPerPet(selectedPet.id)} />
              <SharePetModal petId={selectedPet.id} />
              <CreateAppointmentModal petId={selectedPet.id} onCreated={() => loadPerPet(selectedPet.id)} />
            </div>
          ) : (
            <Button variant="outline" className="bg-transparent" disabled>
              Select a pet
            </Button>
          )}
        </div>
        <PetQuickGrid pets={pets} selectedId={selectedId} onSelect={setSelectedId} />
      </section>

      {selectedPet && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <PetHealthSnapshot
              vitals={vitals}
              allergies={allergies}
              conditions={conditions}
              healthScore={computeHealthScore(vitals)}
            />
            <InsightAlertList items={insights as any} />
          </div>
          <div className="space-y-3">
            <VaccinationDueCard item={nextVaccine} />
            <ReminderPillList items={reminders as any} />
          </div>
        </section>
      )}

      {selectedPet && (
        <section className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <UpcomingAppointmentsList items={appointments as any} />
          </div>
          <div>
            <RecentMediaStrip items={media as any} />
          </div>
        </section>
      )}
    </div>
  )
}

function computeHealthScore(
  vitals?: { weight_kg?: number | null; temperature_c?: number | null; heart_rate_bpm?: number | null } | null,
) {
  if (!vitals) return null
  let score = 80
  if (vitals.temperature_c && (vitals.temperature_c < 37 || vitals.temperature_c > 39.5)) score -= 15
  if (vitals.heart_rate_bpm && (vitals.heart_rate_bpm < 60 || vitals.heart_rate_bpm > 160)) score -= 15
  return Math.max(0, Math.min(100, score))
}
