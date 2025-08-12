"use client"

import { createBrowserClient } from "@supabase/ssr"
import { isSupabaseConfigured, getSupabaseConfig } from "./supabase-config"

// Create a singleton instance of the Supabase client for Client Components
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseInstance) {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase environment variables are not configured")
    }

    const config = getSupabaseConfig()
    supabaseInstance = createBrowserClient(config.url, config.anonKey)
  }
  return supabaseInstance
}

export function createClient() {
  return getSupabaseBrowserClient()
}

export default getSupabaseBrowserClient
