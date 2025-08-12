import { getSupabaseServerClient } from "@/lib/supabase-server"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { ProviderDashboard } from "@/components/dashboard/provider-dashboard"

async function getProviderData() {
  const supabase = getSupabaseServerClient()
  const { data: auth } = await supabase.auth.getUser()
  const user = auth.user
  if (!user) return null

  // Get provider profile and organization data
  const { data: providerProfile } = await supabase
    .from("provider_profiles")
    .select(`
      *,
      organizations(*)
    `)
    .eq("user_id", user.id)
    .single()

  // Get today's bookings
  const today = new Date().toISOString().split("T")[0]
  const { data: todayBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      pets(name, species, photo_url),
      profiles!bookings_owner_id_fkey(first_name, last_name)
    `)
    .eq("provider_id", user.id)
    .gte("start_date", today)
    .lte("end_date", today)
    .order("created_at", { ascending: false })

  return {
    providerProfile,
    todayBookings: todayBookings || [],
  }
}

export default async function ProviderDashboardPage() {
  const data = await getProviderData()

  return (
    <RoleGuard allowedRoles={["service_provider"]}>
      <div className="mx-auto w-full max-w-7xl p-4 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Provider Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your bookings, clients, and business operations.</p>
        </div>
        <ProviderDashboard initialData={data} />
      </div>
    </RoleGuard>
  )
}
