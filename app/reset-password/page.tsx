import type { Metadata } from "next"
import ResetPasswordClientPage from "./ResetPasswordClientPage"

export const metadata: Metadata = {
  title: "Reset Password - FluffyPet",
  description: "Reset your FluffyPet account password",
}

export default function ResetPasswordPage() {
  return <ResetPasswordClientPage />
}
