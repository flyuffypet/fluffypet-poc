import { AdminRoleGuard } from "@/components/admin/admin-role-guard"
import { UserManagement } from "@/components/admin/user-management"

export default function AdminUsersPage() {
  return (
    <AdminRoleGuard requiredRole="admin">
      <div className="container mx-auto p-4">
        <UserManagement />
      </div>
    </AdminRoleGuard>
  )
}
