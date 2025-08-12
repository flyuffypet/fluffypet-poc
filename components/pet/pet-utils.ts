import type { Pet, UserRole } from "./types"

function get(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), obj)
}

export function filterPetForRole(pet: Pet, role: UserRole): Pet {
  // Admins and Owners can see full details.
  if (role === "admin" || role === "owner") return pet

  // Providers and Vets see only allowed fields based on privacy.sharedFields.
  const allowed = new Set(
    pet.privacy?.sharedFields ?? ["name", "species", "breed", "sex", "ageYears", "weightKg", "medical.vaccines"],
  )
  const base: Pet = {
    id: pet.id,
    name: pet.name,
  }

  const candidateKeys = [
    "species",
    "breed",
    "sex",
    "ageYears",
    "weightKg",
    "color",
    "avatarUrl",
    "medical.vaccines",
    "medical.allergies",
    "medical.conditions",
    "medical.meds",
    "media",
  ]

  for (const key of candidateKeys) {
    if (allowed.has(key)) {
      const value = get(pet, key)
      if (value !== undefined) {
        // Apply shallow set for top-level, deep for medical nested
        if (key.startsWith("medical.")) {
          const mk = key.replace("medical.", "")
          base.medical = base.medical ?? {}
          ;(base.medical as any)[mk] = value
        } else {
          ;(base as any)[key] = value
        }
      }
    }
  }

  return base
}

export function roleLabel(role: UserRole) {
  switch (role) {
    case "owner":
      return "Owner"
    case "provider":
      return "Service Provider"
    case "vet":
      return "Veterinarian"
    case "admin":
      return "Admin"
    default:
      return "User"
  }
}
