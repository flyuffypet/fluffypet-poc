"use client"

import type React from "react"

import { useDashboardUser } from "@/lib/hooks/use-dashboard-data"
import type { UserRole } from "@/lib/types/dashboard"

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user, loading } = useDashboardUser()

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || <div className="text-center p-8 text-muted-foreground">Access denied</div>
  }

  return <>{children}</>
}
