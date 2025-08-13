"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-client"
import { FaGoogle, FaGithub } from "react-icons/fa"

interface SocialAuthButtonsProps {
  redirectTo?: string
}

export default function SocialAuthButtons({ redirectTo = "/dashboard" }: SocialAuthButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      setLoading(provider)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        console.error(`${provider} auth error:`, error.message)
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => handleSocialAuth("google")}
        disabled={loading !== null}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </Button>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => handleSocialAuth("github")}
        disabled={loading !== null}
      >
        <FaGithub className="mr-2 h-4 w-4" />
        {loading === "github" ? "Connecting..." : "Continue with GitHub"}
      </Button>
    </div>
  )
}

export { SocialAuthButtons }
