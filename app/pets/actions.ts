"use server"

import type { Pet } from "@/components/pet/types"
import { fetchPetByIdFromSupabase } from "@/lib/pets"

// Server action: fetches a pet by ID with Supabase RLS.
export async function fetchPetById(petId: string): Promise<Pet | null> {
  if (!petId) return null
  return fetchPetByIdFromSupabase(petId)
}
