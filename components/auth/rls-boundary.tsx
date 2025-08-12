"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

type RLSBoundaryProps = {
  orgId: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

// Client-side membership check. RLS remains enforced in the DB regardless.
export default function RLSBoundary({ orgId, children, fallback = null }: RLSBoundaryProps) {
  const supabase = getSupabaseBrowserClient()
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    let cancel = false
    async function check() {
      const { data: userRes } = await supabase.auth.getUser()
      const user = userRes.user
      if (!user) {
        if (!cancel) setAllowed(false)
        return
      }
      const { data, error } = await supabase
        .from("organization_users")
        .select("id")
        .eq("org_id", orgId)
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle()
      if (!cancel) setAllowed(Boolean(data && !error))
    }
    check()
    return () => {
      cancel = true
    }
  }, [orgId, supabase])

  if (allowed === null) return null
  return allowed ? <>{children}</> : <>{fallback}</>
}
