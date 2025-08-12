import SessionGuard from "@/components/auth/session-guard"
import PetForm from "@/components/pets/pet-form"

export default async function NewPetPage() {
  return (
    <SessionGuard>
      <div className="mx-auto w-full max-w-3xl p-4 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Create Pet</h1>
          <p className="text-sm text-muted-foreground">Register your pet. You can add media and records later.</p>
        </div>
        <PetForm />
      </div>
    </SessionGuard>
  )
}
