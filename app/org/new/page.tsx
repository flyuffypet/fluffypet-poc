import SessionGuard from "@/components/auth/session-guard"
import CreateOrgForm from "@/components/org/create-org-form"

export default async function NewOrgPage() {
  return (
    <SessionGuard>
      <div className="mx-auto w-full max-w-lg p-4">
        <h1 className="mb-2 text-2xl font-semibold">Create organization</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Set up your Clinic, NGO, Breeder, Hostel, or Solo Provider profile.
        </p>
        <CreateOrgForm />
      </div>
    </SessionGuard>
  )
}
