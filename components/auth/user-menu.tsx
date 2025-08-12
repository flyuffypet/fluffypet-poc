"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Building2, LogIn, UserPlus } from "lucide-react"

type SessionUser = {
  id: string
  email?: string
  user_metadata?: Record<string, any>
}

export default function UserMenu() {
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancel = false
    async function load() {
      try {
        const { data } = await supabase.auth.getUser()
        if (!cancel) setUser((data.user as any) || null)
      } finally {
        if (!cancel) setLoading(false)
      }
    }
    load()

    // Listen for auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser((session?.user as any) || null)
    })
    return () => {
      cancel = true
      sub.subscription.unsubscribe()
    }
  }, [supabase])

  async function signOut() {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" aria-label="Account">
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (!user) {
    // Logged out: icon that opens dropdown to sign in/up
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Account menu">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Welcome</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/login" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" /> Sign in
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/signup" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" /> Create account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Logged in: show avatar/email and actions
  const email = user.email || "User"
  const initial = email?.[0]?.toUpperCase() || "U"
  const avatarUrl = (user.user_metadata?.avatar_url as string) || ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Account menu">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="User avatar" />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/org/dashboard" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" /> Org dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
