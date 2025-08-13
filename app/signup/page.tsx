import AuthForm from "@/components/auth/auth-form"

export const metadata = {
  title: "Sign Up - FluffyPet",
  description: "Create your FluffyPet account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signup" />
    </div>
  )
}
