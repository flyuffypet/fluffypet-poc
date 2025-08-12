import { createServerClient } from "@/lib/supabase-server"
import { RescueDirectory } from "@/components/rescue/rescue-directory"

export const dynamic = "force-dynamic"

async function getRescueCases() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }

  try {
    const supabase = createServerClient()

    // Only show public rescue cases with limited information
    const { data: rescueCases } = await supabase
      .from("rescue_cases")
      .select(`
        id,
        case_number,
        species,
        location_area,
        status,
        priority,
        created_at,
        estimated_cost,
        description_public,
        organizations!inner(
          id,
          name,
          is_verified
        )
      `)
      .eq("is_public", true)
      .eq("organizations.is_active", true)
      .order("created_at", { ascending: false })
      .limit(50)

    return rescueCases || []
  } catch (error) {
    console.error("Error fetching rescue cases:", error)
    return []
  }
}

export default async function RescuesPage() {
  const rescueCases = await getRescueCases()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Active Rescue Operations</h1>
          <p className="text-gray-600">
            Supporting ongoing rescue efforts across the community. Sensitive information is protected for animal
            safety.
          </p>
        </div>
      </div>

      <RescueDirectory rescueCases={rescueCases} />
    </div>
  )
}

export const metadata = {
  title: "Active Rescues - FluffyPet",
  description: "Supporting ongoing rescue efforts across the community. Help save lives.",
}
