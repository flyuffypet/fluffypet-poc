export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

// Validate required environment variables
if (!supabaseConfig.url) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseConfig.anonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  name: "FluffyPet",
  description: "Comprehensive pet care platform",
}
