import { getSupabaseServerClient } from "@/lib/supabase-server"
import PetCard from "@/components/pet/pet-card"
import type { PetListFilterState } from "@/components/pets/pet-list-filters"
import CreatePetButton from "@/components/pets/create-pet-button"
import { Suspense } from "react"

async function getPets(filter: PetListFilterState) {
  const supabase = getSupabaseServerClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return []

  // Base query: owned + collaborated
  const owned = supabase.from("pets").select("*").eq("owner_id", user.id)
  const collab = supabase.from("pet_collaborators").select("pet_id, pets:pet_id(*)").eq("user_id", user.id)

  const [{ data: ownedRows }, { data: collabRows }] = await Promise.all([owned, collab])
  let rows: any[] = [
    ...(ownedRows || []),
    ...((collabRows || []).map((r: any) => r.pets).filter(Boolean) as any[]),
  ].reduce((acc: any[], p: any) => {
    if (!acc.find((x) => x.id === p.id)) acc.push(p)
    return acc
  }, [])

  if (filter.species) rows = rows.filter((r) => r.species === filter.species)
  if (filter.status) rows = rows.filter((r) => (r.status || "active") === filter.status)
  if (filter.q) {
    const q = filter.q.toLowerCase()
    rows = rows.filter((r) => `${r.name} ${r.breed || ""}`.toLowerCase().includes(q))
  }

  return rows
}

export default async function PetsPage() {
  // Start with both undefined; client filter will re-render via suspense
  const pets = await getPets({})

  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-4">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Pets</h1>
          <p className="text-sm text-muted-foreground">Browse and manage your pets.</p>
        </div>
        <CreatePetButton />
      </div>

      {/* Filters (client) */}
      <Suspense fallback={null}>{/* Non-interrupting; filtering occurs client-side on initial list */}</Suspense>

      {pets.length === 0 ? (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          No pets yet. Click “Add Pet” to create your first companion.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((p: any) => (
            <PetCard
              key={p.id}
              pet={{
                id: p.id,
                name: p.name,
                species: p.species || undefined,
                breed: p.breed || undefined,
                sex: (p.sex as any) || "unknown",
                ageYears: undefined,
                weightKg: undefined,
                avatarUrl: p.photo_url || undefined,
              }}
              role="owner"
            />
          ))}
        </div>
      )}
    </div>
  )
}
