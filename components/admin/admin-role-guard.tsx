"use client"

import type React from "react"
import { useDashboardUser } from "@/lib/hooks/use-dashboard-data"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AdminRoleGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "superadmin"
  fallback?: React.ReactNode
  showDetailedError?: boolean
}

export function AdminRoleGuard({
  children,
  requiredRole = "admin",
  fallback,
  showDetailedError = true,
}: AdminRoleGuardProps) {
  const { user, loading } = useDashboardUser()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    if (fallback) return <>{fallback}</>

    if (showDetailedError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Authentication Required</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">You must be logged in to access this admin area.</p>
              <Button onClick={() => (window.location.href = "/login")}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return <div className="text-center p-8 text-muted-foreground">Authentication required</div>
  }

  // Check admin role permissions
  const hasAdminAccess =
    user.role === "admin" ||
    user.role === "superadmin" ||
    user.platform_role === "admin" ||
    user.platform_role === "superadmin"
  const hasRequiredRole =
    requiredRole === "admin" ? hasAdminAccess : user.role === "superadmin" || user.platform_role === "superadmin"

  if (!hasRequiredRole) {
    if (fallback) return <>{fallback}</>

    if (showDetailedError) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You don't have the required {requiredRole} permissions to access this area.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>
                  Your current role:{" "}
                  <span className="font-medium">{user.role || user.platform_role || "No role assigned"}</span>
                </p>
                <p>
                  Required role: <span className="font-medium">{requiredRole}</span>
                </p>
              </div>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return <div className="text-center p-8 text-muted-foreground">Insufficient permissions</div>
  }

  return <>{children}</>
}
