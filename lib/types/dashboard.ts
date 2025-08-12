export type UserRole = "pet_owner" | "service_provider" | "veterinarian" | "admin" | "volunteer" | "superadmin"

export type OrgType =
  | "vet_clinic"
  | "grooming_salon"
  | "training_center"
  | "hostel"
  | "ngo"
  | "rescue"
  | "shelter"
  | "breeding_facility"

export interface DashboardUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  platform_role?: string
  avatar_url?: string
  organizations?: Organization[]
  active_org_id?: string
}

export interface Organization {
  id: string
  name: string
  org_type: OrgType
  logo_url?: string
  status: string
}

export interface Pet {
  id: string
  name: string
  species: string
  breed?: string
  owner_id: string
  photo_url?: string
  date_of_birth?: string
  gender?: string
  status: string
  allergies?: string[]
  medications?: any
  health_summary?: any
}

export interface Appointment {
  id: string
  pet_id: string
  provider_id: string
  scheduled_at: string
  duration_minutes: number
  status: string
  service_id: string
  total_cost?: number
  notes?: string
}

export interface MedicalRecord {
  id: string
  pet_id: string
  title: string
  record_type: string
  description?: string
  diagnosis?: string
  treatment?: string
  veterinarian_id?: string
  created_at: string
  follow_up_required?: boolean
  follow_up_date?: string
}

export interface AIInsight {
  id: string
  pet_id: string
  insight_type: string
  severity?: string
  recommendation?: string
  details: any
  is_acknowledged?: boolean
  created_at: string
}

export interface Reminder {
  id: string
  pet_id: string
  user_id: string
  reminder_type: string
  content: string
  due_date: string
  status: string
}
