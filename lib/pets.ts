import { getSupabaseServerClient } from "@/lib/supabase-server"
import type { Pet, PetMedia } from "@/components/pet/types"

function toYearsFromDob(dob?: string | null): number | undefined {
  if (!dob) return undefined
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return undefined
  const diff = Date.now() - birth.getTime()
  return Math.max(0, Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)))
}

function mapMediaRows(mediaRows: any[] | null | undefined): PetMedia[] | undefined {
  if (!mediaRows || mediaRows.length === 0) return undefined
  return mediaRows.map((m) => {
    const kind =
      m.media_type === "image" || m.media_type === "video" || m.media_type === "audio" || m.media_type === "document"
        ? m.media_type
        : "document"
    return {
      url: m.file_url, // Blob pointer; signed in UI via /api/blob/sign
      name: m.original_filename ?? m.filename ?? "Media",
      kind,
    } as PetMedia
  })
}

export async function fetchPetByIdFromSupabase(petId: string): Promise<Pet | null> {
  const supabase = getSupabaseServerClient()

  // 1) Fetch the pet row. We keep it flexible by selecting *, then mapping known fields.
  // Known columns from project knowledge: id, owner_id, name, photo_url (avatar), optional dob/medical json [^1]
  const { data: petRow, error: petErr } = await supabase.from("pets").select("*").eq("id", petId).maybeSingle()
  if (petErr) throw petErr
  if (!petRow) return null

  // 2) Fetch media via RPC: public.get_pet_media_files(p_pet_id, p_media_type) [^1]
  const { data: mediaRows, error: mediaErr } = await supabase.rpc("get_pet_media_files", {
    p_pet_id: petId,
    p_media_type: null,
  })
  if (mediaErr) {
    // Non-fatal: continue without media
    // console.error(mediaErr)
  }

  // Map to shared Pet type (keep undefined for fields we don't own/know yet)
  const pet: Pet = {
    id: petRow.id,
    name: petRow.name ?? "Pet",
    // Common optional fields if present in your schema
    species: petRow.species ?? petRow.type ?? undefined,
    breed: petRow.breed ?? undefined,
    sex: petRow.sex ?? petRow.gender ?? "unknown",
    ageYears: petRow.age_years ?? toYearsFromDob(petRow.dob ?? petRow.date_of_birth),
    weightKg: petRow.weight_kg ?? petRow.weight ?? undefined,
    color: petRow.color ?? undefined,
    microchipId: petRow.microchip_id ?? undefined,
    dob: petRow.dob ?? petRow.date_of_birth ?? undefined,
    avatarUrl: petRow.photo_url ?? petRow.avatar_url ?? undefined, // from get_owner_activity_feed usage [^1]
    ownerId: petRow.owner_id ?? undefined,
    medical: petRow.medical ?? petRow.medical_data ?? undefined, // JSON as per PoC
    privacy: petRow.privacy ?? undefined, // optional JSON
    media: mapMediaRows(mediaRows),
  }

  return pet
}
