import { createServerClient } from "@/lib/supabase-server"
import { NGODirectory } from "@/components/ngos/ngo-directory"

export const dynamic = "force-dynamic"

export default async function NGOsPage() {
  const supabase = createServerClient()

  let ngos = []
  try {
    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        bio,
        organizations!inner(
          id,
          name,
          org_type,
          description,
          address,
          phone,
          email,
          website,
          is_verified,
          created_at
        )
      `)
      .eq("organizations.org_type", "ngo")
      .eq("organizations.is_active", true)
      .order("organizations.created_at", { ascending: false })

    ngos = data || []
  } catch (error) {
    console.error("Failed to fetch NGOs:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Animal Rescue Organizations</h1>
          <p className="text-gray-600">
            Connect with NGOs, shelters, and rescue organizations working to help animals in need.
          </p>
        </div>
      </div>

      <NGODirectory ngos={ngos} />
    </div>
  )
}

export const metadata = {
  title: "NGOs & Animal Rescues - FluffyPet",
  description: "Connect with NGOs, shelters, and rescue organizations working to help animals in need.",
}
