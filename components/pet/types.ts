export type PetMediaKind = "image" | "document" | "video" | "audio"

export type PetMedia = {
  url: string // Stored Blob URL pointer (not public); will be signed on view
  name?: string
  kind: PetMediaKind
}

export type Vaccine = {
  name: string
  date?: string
  due?: string
  status?: "complete" | "due" | "overdue"
}

export type Medication = {
  name: string
  dose?: string
  schedule?: string
}

export type PetMedical = {
  vaccines?: Vaccine[]
  allergies?: string[]
  conditions?: string[]
  meds?: Medication[]
  notes?: string
}

export type PetPrivacy = {
  // Whether the owner allows sharing with providers/vets by default
  shareWithProviders?: boolean
  // List of field keys allowed to be shared with non-owners (e.g. ["medical.vaccines","medical.allergies","media"])
  sharedFields?: string[]
}

export type Pet = {
  id: string
  name: string
  species?: string
  breed?: string
  sex?: "male" | "female" | "unknown"
  ageYears?: number
  weightKg?: number
  color?: string
  microchipId?: string
  dob?: string
  avatarUrl?: string
  ownerId?: string
  medical?: PetMedical
  privacy?: PetPrivacy
  media?: PetMedia[]
}

export type UserRole = "owner" | "provider" | "vet" | "admin"
