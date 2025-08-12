import { getSupabaseServerClient } from "@/lib/supabase-server"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { VeterinarianDashboard } from "@/components/dashboard/veterinarian-dashboard"

async function getVetData() {
  const supabase = getSupabaseServerClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return null

  // Get veterinarian profile and organization data
  const { data: vetProfile } = await supabase
    .from("provider_profiles")
    .select(`
      *,
      organizations(*)
    `)
    .eq("user_id", user.id)
    .single()

  // Get today's appointments
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAppointments } = await supabase
    .from("appointments")
    .select(`
      *,
      pets(name, species, breed, photo_url, allergies, medications),
      profiles!appointments_owner_id_fkey(first_name, last_name, phone)
    `)
    .eq("provider_id", user.id)
    .gte("scheduled_at", today)
    .lt("scheduled_at", `${today}T23:59:59`)
    .order("scheduled_at", { ascending: true })

  // Get recent medical records
  const { data: recentRecords } = await supabase
    .from("medical_records")
    .select(`
      *,
      pets(name, species, owner_id),
      profiles!pets_owner_id_fkey(first_name, last_name)
    `)
    .eq("veterinarian_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return {
    vetProfile,
    todayAppointments: todayAppointments || [],
    recentRecords: recentRecords || [],
  }
}

export default async function VetDashboardPage() {
  const data = await getVetData()

  return (
    <RoleGuard allowedRoles={["veterinarian"]}>
      <div className="mx-auto w-full max-w-7xl p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Veterinarian Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage appointments, patient records, and clinical workflows.</p>
        </div>
        <VeterinarianDashboard initialData={data} />
      </div>
    </RoleGuard>
  )
}
