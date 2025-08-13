"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface SocialAuthButtonsProps {
  redirectTo?: string
}

export function SocialAuthButtons({ redirectTo = "/dashboard" }: SocialAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      setIsLoading(provider)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
        },
      })

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
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
          <Icons.github className="mr-2 h-4 w-4" />
        )}
        GitHub
      </Button>
    </div>
  )
}

export default SocialAuthButtons
