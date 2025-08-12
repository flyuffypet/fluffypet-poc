import SessionGuard from "@/components/auth/session-guard"
import OrgSwitcher from "@/components/org/org-switcher"

export default async function SwitchOrgPage() {
  return (
    <SessionGuard>
      <div className="mx-auto w-full max-w-xl p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Switch organization</h1>
        <OrgSwitcher />
      </div>
    </SessionGuard>
  )
}
