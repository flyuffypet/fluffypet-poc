import { createServerClient } from "@/lib/supabase-server"
import { AdoptionDirectory } from "@/components/adoption/adoption-directory"

export const dynamic = "force-dynamic"

async function getAdoptablePets() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }

  try {
    const supabase = createServerClient()

    const { data: pets } = await supabase
      .from("pets")
      .select(`
        id,
        name,
        species,
        breed,
        age,
        gender,
        size,
        description,
        adoption_status,
        adoption_fee,
        special_needs,
        good_with_kids,
        good_with_pets,
        energy_level,
        pet_images(image_url, alt_text, display_order),
        organizations!inner(
          id,
          name,
          org_type,
          address,
          phone,
          email,
          is_verified
        )
      `)
      .eq("adoption_status", "available")
      .in("organizations.org_type", ["ngo", "breeder"])
      .eq("organizations.is_active", true)
      .order("created_at", { ascending: false })

    return pets || []
  } catch (error) {
    console.error("Error fetching adoptable pets:", error)
    return []
  }
}

export default async function AdoptPage() {
  const pets = await getAdoptablePets()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Companion</h1>
          <p className="text-gray-600">
            Browse adoptable pets from verified NGOs and responsible breeders. Every adoption saves a life.
          </p>
        </div>
      </div>

      <AdoptionDirectory pets={pets} />
    </div>
  )
}

export const metadata = {
  title: "Adopt a Pet - FluffyPet",
  description: "Find your perfect companion from verified NGOs and responsible breeders. Every adoption saves a life.",
}
