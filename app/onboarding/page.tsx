import SessionGuard from "@/components/auth/session-guard"
import EnhancedRoleSelector from "@/components/onboarding/enhanced-role-selector"

export default async function OnboardingPage() {
  return (
    <SessionGuard>
      <div className="mx-auto w-full max-w-4xl p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to FluffyPet</h1>
          <p className="text-lg text-muted-foreground">
            Let's get you set up! Choose how you'll be using the platform.
          </p>
        </div>

        <EnhancedRoleSelector />

        <div className="text-center text-sm text-muted-foreground">
          <p>You can always change your role or join additional organizations later.</p>
        </div>
      </div>
    </SessionGuard>
  )
}
