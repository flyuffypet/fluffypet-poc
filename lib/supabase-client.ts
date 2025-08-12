import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// For client components
export const supabase = createClientComponentClient()

export default supabase
