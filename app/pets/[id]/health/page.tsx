import { getSupabaseServerClient } from "@/lib/supabase-server"
import RecordTimeline from "@/components/health/record-timeline"
import { Button } from "@/components/ui/button"
import Link from "next/link"

async function getHealth(id: string) {
  const supabase = getSupabaseServerClient()
  const { data: records } = await supabase
    .from("medical_records")
    .select("*")
    .eq("pet_id", id)
    .order("recorded_at", { ascending: false })
    .limit(100)
  const { data: vac } = await supabase
    .from("vaccinations")
    .select("*")
    .eq("pet_id", id)
    .order("due_on", { ascending: true })
  const { data: med } = await supabase
    .from("medications")
    .select("*")
    .eq("pet_id", id)
    .order("start_on", { ascending: false })
  const { data: alg } = await supabase.from("allergies").select("*").eq("pet_id", id)
  const { data: lab } = await supabase
    .from("lab_results")
    .select("*")
    .eq("pet_id", id)
    .order("taken_on", { ascending: false })
  const { data: cond } = await supabase
    .from("conditions")
    .select("*")
    .eq("pet_id", id)
    .order("created_at", { ascending: false })
  return { records: records || [], vac: vac || [], med: med || [], alg: alg || [], lab: lab || [], cond: cond || [] }
}

export default async function PetHealthPage({ params }: { params: { id: string } }) {
  const data = await getHealth(params.id)
  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <Button asChild variant="outline" className="bg-transparent">
          <Link href={`/pets/${params.id}/health?new=record`}>Add Record</Link>
        </Button>
      </div>
      <RecordTimeline items={data.records as any} />
      {/* Tables can be added below; kept concise for PoC */}
    </div>
  )
}
