"use client"

import { createBrowserClient } from "@supabase/ssr"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a singleton instance of the Supabase client for Client Components
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseInstance) {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase environment variables are not configured")
    }

    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabaseInstance
}

export function createClient() {
  return getSupabaseBrowserClient()
}

export default getSupabaseBrowserClient
