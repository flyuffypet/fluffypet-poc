import { createServerClient } from "@/lib/supabase-server"
import { ProviderDirectory } from "@/components/providers/provider-directory"

export const dynamic = "force-dynamic"

export default async function ProvidersPage() {
  const supabase = createServerClient()

  let providers = []
  try {
    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        avatar_url,
        organizations!inner(
          id,
          name,
          org_type,
          description,
          address,
          is_verified,
          created_at
        )
      `)
      .eq("organizations.is_active", true)
      .order("organizations.created_at", { ascending: false })

    providers = data || []
  } catch (error) {
    console.error("Failed to fetch providers:", error)
    // Providers will remain empty array, component will handle empty state
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Find Pet Care Providers</h1>
          <p className="text-gray-600">
            Discover trusted veterinarians, groomers, trainers, and other pet care professionals near you.
          </p>
        </div>
      </div>

      <ProviderDirectory providers={providers} />
    </div>
  )
}

export const metadata = {
  title: "Pet Care Providers - FluffyPet",
  description: "Find trusted veterinarians, groomers, trainers, and pet care professionals near you.",
}
