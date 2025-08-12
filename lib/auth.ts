import { getSupabaseServerClient } from "@/lib/supabase-server"
import type { UserRole } from "@/components/pet/types"

// Derive the current user's app_role using public.get_current_user_role() [^1].
export async function getCurrentUserRole(): Promise<UserRole> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.rpc("get_current_user_role")
  if (error) {
    // Fallback to "owner" in PoC
    return "owner"
  }
  // Map database enum/app_role to UI role names if needed
  switch ((data as string)?.toLowerCase()) {
    case "admin":
      return "admin"
    case "vet":
    case "veterinarian":
      return "vet"
    case "provider":
    case "service_provider":
      return "provider"
    default:
      return "owner"
  }
}
