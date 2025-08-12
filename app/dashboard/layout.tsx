import type React from "react"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={["pet_owner", "service_provider", "veterinarian", "admin", "volunteer", "superadmin"]}>
      <MobileLayout>
        <div className="min-h-screen bg-background">{children}</div>
      </MobileLayout>
    </RoleGuard>
  )
}
