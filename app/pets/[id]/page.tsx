import { getSupabaseServerClient } from "@/lib/supabase-server"
import PetHeader from "@/components/pets/pet-header"
import VitalsMini from "@/components/pets/vitals-mini"
import InsightMiniList from "@/components/pets/insight-mini-list"
import NextDueVaccination from "@/components/pets/next-due-vaccination"
import AllergyChips from "@/components/pets/allergy-chips"
import ActionBar from "@/components/pets/action-bar"

async function getData(id: string) {
  const supabase = getSupabaseServerClient()

  const { data: pet } = await supabase.from("pets").select("*").eq("id", id).maybeSingle()

  const { data: insights } = await supabase
    .from("ai_insights")
    .select("id,title,severity")
    .eq("pet_id", id)
    .eq("is_acknowledged", false)
    .order("created_at", { ascending: false })
    .limit(3)

  const { data: nextVac } = await supabase
    .from("vaccinations")
    .select("vaccine_name, due_on")
    .eq("pet_id", id)
    .gt("due_on", new Date().toISOString())
    .order("due_on", { ascending: true })
    .maybeSingle()

  const { data: allergyRows } = await supabase.from("allergies").select("allergen").eq("pet_id", id)
  const allergies = (allergyRows || []).map((a) => a.allergen).filter(Boolean)

  // latest vitals from medical_records (data JSONB)
  const { data: vitalsRec } = await supabase
    .from("medical_records")
    .select("data")
    .eq("pet_id", id)
    .eq("record_type", "vitals")
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return { pet, insights: insights || [], nextVac: nextVac || null, allergies, vitals: vitalsRec?.data || null }
}

export default async function PetOverviewPage({ params }: { params: { id: string } }) {
  const { pet, insights, nextVac, allergies, vitals } = await getData(params.id)
  if (!pet) {
    return <div className="p-4 text-sm text-muted-foreground">Pet not found.</div>
  }

  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-4">
      <PetHeader pet={pet} />
      <ActionBar petId={pet.id} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-semibold mb-2">Insights</div>
            <InsightMiniList items={insights} />
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-semibold mb-2">Vitals</div>
            <VitalsMini vitals={vitals} />
          </div>
        </div>
        <div className="space-y-3">
          <NextDueVaccination item={nextVac} />
          <div className="rounded-lg border p-3">
            <div className="text-sm font-semibold mb-2">Allergies</div>
            <AllergyChips items={allergies} />
          </div>
        </div>
      </div>
    </div>
  )
}
