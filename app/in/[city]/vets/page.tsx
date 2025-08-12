import { createServerClient } from "@/lib/supabase-server"
import { CityVetDirectory } from "@/components/seo/city-vet-directory"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

const supportedCities = [
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand" },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra" },
  { slug: "delhi", name: "Delhi", state: "Delhi" },
  { slug: "bangalore", name: "Bangalore", state: "Karnataka" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana" },
  { slug: "pune", name: "Pune", state: "Maharashtra" },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu" },
]

async function getCityVets(citySlug: string) {
  const city = supportedCities.find((c) => c.slug === citySlug)
  if (!city) return { city: null, vets: [] }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { city, vets: [] }
  }

  try {
    const supabase = createServerClient()

    const { data: vets } = await supabase
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
          created_at,
          services(
            id,
            name,
            description,
            price_range_min,
            price_range_max
          )
        )
      `)
      .eq("organizations.org_type", "clinic")
      .eq("organizations.is_active", true)
      .ilike("organizations.address", `%${city.name}%`)
      .order("organizations.created_at", { ascending: false })

    return { city, vets: vets || [] }
  } catch (error) {
    console.error("Error fetching city vets:", error)
    return { city, vets: [] }
  }
}

export default async function CityVetsPage({ params }: { params: { city: string } }) {
  const { city, vets } = await getCityVets(params.city)

  if (!city) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Veterinarians in {city.name}</h1>
          <p className="text-gray-600">
            Find trusted veterinary clinics and animal hospitals in {city.name}, {city.state}. Book appointments with
            verified professionals.
          </p>
        </div>
      </div>

      <CityVetDirectory city={city} vets={vets} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { city: string } }) {
  const { city } = await getCityVets(params.city)

  if (!city) {
    return {
      title: "City Not Found - FluffyPet",
    }
  }

  return {
    title: `Best Veterinarians in ${city.name} - FluffyPet`,
    description: `Find and book appointments with top-rated veterinarians in ${city.name}, ${city.state}. Trusted pet care professionals near you.`,
  }
}

export async function generateStaticParams() {
  return supportedCities.map((city) => ({
    city: city.slug,
  }))
}
