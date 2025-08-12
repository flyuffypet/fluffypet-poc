import type React from "react"
import { AdminRoleGuard } from "@/components/admin/admin-role-guard"
import { MobileLayout } from "@/components/mobile/mobile-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRoleGuard requiredRole="admin" showDetailedError={true}>
      <MobileLayout>
        <div className="min-h-screen bg-background">{children}</div>
      </MobileLayout>
    </AdminRoleGuard>
  )
}
