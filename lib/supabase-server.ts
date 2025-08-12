import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"
import { isSupabaseConfigured, getSupabaseConfig } from "./supabase-config"

// Create a cached version of the Supabase client for Server Components
export const getSupabaseServerClient = cache(() => {
  const cookieStore = cookies()

  if (!isSupabaseConfigured) {
    console.warn("Supabase environment variables are not set. Using dummy client.")
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: "PGRST116" } }),
          }),
        }),
        insert: () => Promise.resolve({ error: null }),
        update: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    } as any
  }

  const config = getSupabaseConfig()
  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
})

// Export getSupabaseServerClient as alias for compatibility with existing imports
export const SupabaseServerClient = getSupabaseServerClient

// Export the original function for compatibility
export { createServerClient }
