import { Suspense } from "react"
import { ResetPasswordClientPage } from "./reset-password-client-page"

export const metadata = {
  title: "Reset Password - FluffyPet",
  description: "Reset your FluffyPet account password",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordClientPage />
      </Suspense>
    </div>
  )
}
