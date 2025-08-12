import { getSupabaseServerClient } from "@/lib/supabase-server"
import OwnerDashboard from "@/components/dashboard/owner-dashboard"

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

async function getAccessiblePets(): Promise<PetRow[]> {
  const supabase = getSupabaseServerClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return []

  const ownedQ = supabase
    .from("pets")
    .select("id,name,species,breed,dob,status,photo_url,updated_at")
    .eq("owner_id", user.id)
  const collabQ = supabase
    .from("pet_collaborators")
    .select("pet_id, pets:pet_id(id,name,species,breed,dob,status,photo_url,updated_at)")
    .eq("user_id", user.id)

  const [{ data: owned }, { data: collab }] = await Promise.all([ownedQ, collabQ])

  const all = [...(owned || []), ...((collab || []).map((x: any) => x.pets).filter(Boolean) as any[])].reduce(
    (acc: any[], p: any) => {
      if (!acc.find((x) => x.id === p.id)) acc.push(p)
      return acc
    },
    [],
  )

  return all as PetRow[]
}

export default async function DashboardPage() {
  const pets = await getAccessiblePets()

  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Owner Home</h1>
        <p className="text-sm text-muted-foreground">
          Quick snapshot per pet: health, insights, appointments, media and reminders.
        </p>
      </div>
      <OwnerDashboard initialPets={pets} />
    </div>
  )
}
