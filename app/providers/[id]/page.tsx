import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { ProviderProfile } from "@/components/providers/provider-profile"

interface ProviderPageProps {
  params: { id: string }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const supabase = createServerClient()

  const { data: provider, error } = await supabase
    .from("profiles")
    .select(`
      *,
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
        duration_minutes,
        is_active
      ),
      reviews:provider_reviews(
        id,
        rating,
        comment,
        created_at,
        reviewer:profiles!reviewer_id(full_name)
      )
    `)
    .eq("id", params.id)
    .eq("organizations.is_active", true)
    .single()

  if (error || !provider) {
    notFound()
  }

  return <ProviderProfile provider={provider} />
}

export async function generateMetadata({ params }: ProviderPageProps) {
  const supabase = createServerClient()

  const { data: provider } = await supabase
    .from("profiles")
    .select("full_name, organizations!inner(name, description)")
    .eq("id", params.id)
    .single()

  if (!provider) {
    return {
      title: "Provider Not Found - FluffyPet",
    }
  }

  return {
    title: `${provider.full_name} - ${provider.organizations.name} | FluffyPet`,
    description: provider.organizations.description || `Professional pet care services by ${provider.full_name}`,
  }
}
