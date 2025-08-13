import AuthForm from "@/components/auth/auth-form"

export const metadata = {
  title: "Sign In - FluffyPet",
  description: "Sign in to your FluffyPet account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm mode="signin" />
    </div>
  )
}
