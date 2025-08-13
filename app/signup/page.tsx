import AuthForm from "@/components/auth/auth-form"

export const metadata = {
  title: "Sign Up - FluffyPet",
  description: "Create your FluffyPet account",
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <AuthForm mode="signup" />
    </div>
  )
}
