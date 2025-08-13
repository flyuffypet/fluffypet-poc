"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

interface SocialAuthButtonsProps {
  redirectTo?: string
}

export default function SocialAuthButtons({ redirectTo }: SocialAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      setIsLoading(provider)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(`${provider} auth error:`, error.message)
      }
    } catch (error) {
      console.error(`${provider} auth error:`, error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() => handleSocialAuth("google")}
        disabled={isLoading !== null}
        className="w-full"
      >
        {isLoading === "google" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>

      <Button
        variant="outline"
        onClick={() => handleSocialAuth("github")}
        disabled={isLoading !== null}
        className="w-full"
      >
        {isLoading === "github" ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  )
}
