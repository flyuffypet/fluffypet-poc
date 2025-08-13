import { Suspense } from "react"
import ResetPasswordClientPage from "./reset-password-client-page"

export const metadata = {
  title: "Reset Password - FluffyPet",
  description: "Reset your FluffyPet account password",
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClientPage />
    </Suspense>
  )
}
