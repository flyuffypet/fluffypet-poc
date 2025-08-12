import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function SessionGuard({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) redirect("/login")
  return <>{children}</>
}
