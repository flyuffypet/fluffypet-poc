export const DATABASE_ENUMS = {
  USER_ROLE: [
    "admin",
    "e-commerce_vendor",
    "pet_owner",
    "service_provider",
    "superadmin",
    "veterinarian",
    "volunteer",
  ] as const,
  PLATFORM_ROLE: ["admin", "compliance_officer", "moderator", "superadmin"] as const,
  STATUS_TYPE: ["active", "deleted", "inactive", "pending", "pending_review", "rejected", "suspended"] as const,
  APPOINTMENT_STATUS: [
    "cancelled",
    "completed",
    "confirmed",
    "in_progress",
    "no_show",
    "rescheduled",
    "scheduled",
  ] as const,
  BOOKING_STATUS: ["cancelled", "completed", "confirmed", "in_progress", "pending", "refunded"] as const,
  PAYMENT_STATUS: [
    "cancelled",
    "completed",
    "disputed",
    "failed",
    "in_escrow",
    "paid",
    "pending",
    "processing",
    "refunded",
    "released",
  ] as const,
  PET_GENDER: ["female", "male", "unknown"] as const,
  PET_SIZE: ["extra_large", "extra_small", "large", "medium", "small"] as const,
  ORGANIZATION_ROLE: [
    "admin",
    "coordinator",
    "manager",
    "owner",
    "receptionist",
    "staff",
    "veterinarian",
    "volunteer",
  ] as const,
} as const

export type UserRole = (typeof DATABASE_ENUMS.USER_ROLE)[number]
export type PlatformRole = (typeof DATABASE_ENUMS.PLATFORM_ROLE)[number]
export type StatusType = (typeof DATABASE_ENUMS.STATUS_TYPE)[number]
export type AppointmentStatus = (typeof DATABASE_ENUMS.APPOINTMENT_STATUS)[number]
export type BookingStatus = (typeof DATABASE_ENUMS.BOOKING_STATUS)[number]
export type PaymentStatus = (typeof DATABASE_ENUMS.PAYMENT_STATUS)[number]
export type PetGender = (typeof DATABASE_ENUMS.PET_GENDER)[number]
export type PetSize = (typeof DATABASE_ENUMS.PET_SIZE)[number]
export type OrganizationRole = (typeof DATABASE_ENUMS.ORGANIZATION_ROLE)[number]

// Validation functions
export function isValidUserRole(role: string): role is UserRole {
  return DATABASE_ENUMS.USER_ROLE.includes(role as UserRole)
}

export function isValidPlatformRole(role: string): role is PlatformRole {
  return DATABASE_ENUMS.PLATFORM_ROLE.includes(role as PlatformRole)
}

export function isValidStatus(status: string): status is StatusType {
  return DATABASE_ENUMS.STATUS_TYPE.includes(status as StatusType)
}

export function isValidAppointmentStatus(status: string): status is AppointmentStatus {
  return DATABASE_ENUMS.APPOINTMENT_STATUS.includes(status as AppointmentStatus)
}

export function isValidBookingStatus(status: string): status is BookingStatus {
  return DATABASE_ENUMS.BOOKING_STATUS.includes(status as BookingStatus)
}

export function isValidPaymentStatus(status: string): status is PaymentStatus {
  return DATABASE_ENUMS.PAYMENT_STATUS.includes(status as PaymentStatus)
}

export function isValidPetGender(gender: string): gender is PetGender {
  return DATABASE_ENUMS.PET_GENDER.includes(gender as PetGender)
}

export function isValidPetSize(size: string): size is PetSize {
  return DATABASE_ENUMS.PET_SIZE.includes(size as PetSize)
}

export function isValidOrganizationRole(role: string): role is OrganizationRole {
  return DATABASE_ENUMS.ORGANIZATION_ROLE.includes(role as OrganizationRole)
}

// Validation error class
export class DatabaseValidationError extends Error {
  constructor(field: string, value: string, allowedValues: readonly string[]) {
    super(`Invalid ${field}: "${value}". Allowed values: ${allowedValues.join(", ")}`)
    this.name = "DatabaseValidationError"
  }
}

// Comprehensive validation function
export function validateDatabaseEnums(data: Record<string, any>): void {
  const validations = [
    { field: "role", value: data.role, validator: isValidUserRole, enum: DATABASE_ENUMS.USER_ROLE },
    {
      field: "platform_role",
      value: data.platform_role,
      validator: isValidPlatformRole,
      enum: DATABASE_ENUMS.PLATFORM_ROLE,
    },
    { field: "status", value: data.status, validator: isValidStatus, enum: DATABASE_ENUMS.STATUS_TYPE },
    {
      field: "appointment_status",
      value: data.appointment_status,
      validator: isValidAppointmentStatus,
      enum: DATABASE_ENUMS.APPOINTMENT_STATUS,
    },
    {
      field: "booking_status",
      value: data.booking_status,
      validator: isValidBookingStatus,
      enum: DATABASE_ENUMS.BOOKING_STATUS,
    },
    {
      field: "payment_status",
      value: data.payment_status,
      validator: isValidPaymentStatus,
      enum: DATABASE_ENUMS.PAYMENT_STATUS,
    },
    { field: "gender", value: data.gender, validator: isValidPetGender, enum: DATABASE_ENUMS.PET_GENDER },
    { field: "size", value: data.size, validator: isValidPetSize, enum: DATABASE_ENUMS.PET_SIZE },
    {
      field: "organization_role",
      value: data.organization_role,
      validator: isValidOrganizationRole,
      enum: DATABASE_ENUMS.ORGANIZATION_ROLE,
    },
  ]

  for (const { field, value, validator, enum: enumValues } of validations) {
    if (value !== undefined && value !== null && !validator(value)) {
      throw new DatabaseValidationError(field, value, enumValues)
    }
  }
}
