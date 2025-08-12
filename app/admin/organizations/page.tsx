import { AdminRoleGuard } from "@/components/admin/admin-role-guard"
import { OrganizationManagement } from "@/components/admin/organization-management"

export default function AdminOrganizationsPage() {
  return (
    <AdminRoleGuard requiredRole="admin">
      <div className="container mx-auto p-4">
        <OrganizationManagement />
      </div>
    </AdminRoleGuard>
  )
}
