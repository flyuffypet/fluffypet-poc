import { createServerClient } from "@/lib/supabase-server"
import { VetDirectory } from "@/components/vets/vet-directory"

export const dynamic = "force-dynamic"

export default async function VetsPage() {
  const supabase = createServerClient()

  let vets = []
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
          hours,
          is_verified,
          created_at
        ),
        services:organization_services(
          id,
          name,
          description,
          price_min,
          price_max,
          is_active
        )
      `)
      .eq("organizations.org_type", "clinic")
      .eq("organizations.is_active", true)
      .order("organizations.created_at", { ascending: false })

    vets = data || []
  } catch (error) {
    console.error("Failed to fetch vets:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Find Veterinarians & Clinics</h1>
          <p className="text-gray-600">Discover trusted veterinary care professionals and animal hospitals near you.</p>
        </div>
      </div>

      <VetDirectory vets={vets} />
    </div>
  )
}

export const metadata = {
  title: "Veterinarians & Clinics - FluffyPet",
  description: "Find trusted veterinary care professionals and animal hospitals near you.",
}
