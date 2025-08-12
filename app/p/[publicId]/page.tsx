import { createServerClient } from "@/lib/supabase-server"
import { PublicPetProfile } from "@/components/pets/public-pet-profile"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

async function getPublicPetProfile(publicId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  try {
    const supabase = createServerClient()

    // Get pet with public sharing enabled
    const { data: pet } = await supabase
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
        public_share_token,
        public_share_expires_at,
        pet_images(image_url, alt_text, display_order),
        profiles!inner(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("public_share_token", publicId)
      .eq("is_public_shareable", true)
      .gte("public_share_expires_at", new Date().toISOString())
      .single()

    return pet
  } catch (error) {
    console.error("Error fetching public pet profile:", error)
    return null
  }
}

export default async function PublicPetProfilePage({ params }: { params: { publicId: string } }) {
  const pet = await getPublicPetProfile(params.publicId)

  if (!pet) {
    notFound()
  }

  return <PublicPetProfile pet={pet} />
}

export async function generateMetadata({ params }: { params: { publicId: string } }) {
  const pet = await getPublicPetProfile(params.publicId)

  if (!pet) {
    return {
      title: "Pet Profile Not Found - FluffyPet",
      robots: "noindex, nofollow",
    }
  }

  return {
    title: `Meet ${pet.name} - Shared Pet Profile`,
    description: `${pet.name} is a ${pet.age} year old ${pet.breed} ${pet.species.toLowerCase()}. ${pet.description || "Learn more about this adorable pet!"}`,
    robots: "noindex, nofollow", // Prevent search indexing as specified
  }
}
