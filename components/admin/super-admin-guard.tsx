"use client"

import type React from "react"
import { AdminRoleGuard } from "./admin-role-guard"

interface SuperAdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  showDetailedError?: boolean
}

export function SuperAdminGuard({ children, fallback, showDetailedError = true }: SuperAdminGuardProps) {
  return (
    <AdminRoleGuard requiredRole="superadmin" fallback={fallback} showDetailedError={showDetailedError}>
      {children}
    </AdminRoleGuard>
  )
}
