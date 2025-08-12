"use client"

import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { useSearchParams } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { track } from "@vercel/analytics"

export default function SocialAuthButtons() {
  const supabase = getSupabaseBrowserClient()
  const search = useSearchParams()
  const next = search.get("next") || "/onboarding"

  async function signInWithGoogle() {
    try {
      track("oauth_sign_in_attempt", { provider: "google" })
    } catch (analyticsError) {
      console.warn("Analytics tracking failed:", analyticsError)
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: "select_account" },
      },
    })
  }

  return (
    <div className="grid gap-2">
      <Button variant="outline" className="w-full bg-transparent" onClick={signInWithGoogle}>
        <FcGoogle className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>
    </div>
  )
}
