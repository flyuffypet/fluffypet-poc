import { Suspense } from "react"
import ResetPasswordClientPage from "./reset-password-client-page"

export const metadata = {
  title: "Reset Password - FluffyPet",
  description: "Reset your FluffyPet account password",
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <ResetPasswordClientPage />
    </Suspense>
  )
}
