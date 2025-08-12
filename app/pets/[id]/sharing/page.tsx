import { getSupabaseServerClient } from "@/lib/supabase-server"
import CollaboratorTable from "@/components/sharing/collaborator-table"
import VisibilityToggles from "@/components/sharing/visibility-toggles"
import LinkSharePanel from "@/components/sharing/link-share-panel"

async function getPet(id: string) {
  const supabase = getSupabaseServerClient()
  const { data } = await supabase.from("pets").select("id, name, visibility").eq("id", id).maybeSingle()
  return data
}

export default async function PetSharingPage({ params }: { params: { id: string } }) {
  const pet = await getPet(params.id)
  if (!pet) return <div className="p-4 text-sm text-muted-foreground">Pet not found.</div>

  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-4">
      <h2 className="text-xl font-semibold">Sharing & Access</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <VisibilityToggles petId={pet.id} initial={(pet.visibility as any) || "private"} />
        <LinkSharePanel petId={pet.id} />
      </div>
      <CollaboratorTable petId={pet.id} />
    </div>
  )
}
