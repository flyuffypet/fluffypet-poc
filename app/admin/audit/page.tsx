import { SuperAdminGuard } from "@/components/admin/super-admin-guard"
import { AuditLogging } from "@/components/admin/audit-logging"

export default function AdminAuditPage() {
  return (
    <SuperAdminGuard>
      <div className="container mx-auto p-4">
        <AuditLogging />
      </div>
    </SuperAdminGuard>
  )
}
