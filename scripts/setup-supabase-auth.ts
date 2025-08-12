/**
 * Supabase Authentication Setup Script
 * Run this script to verify your Supabase auth configuration
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables:")
  console.error("- NEXT_PUBLIC_SUPABASE_URL")
  console.error("- SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAuthConfiguration() {
  console.log("🚀 Setting up Supabase Authentication Configuration...\n")

  // Check if we can connect to Supabase
  try {
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) throw error
    console.log("✅ Successfully connected to Supabase")
    console.log(`📊 Current user count: ${data.users.length}\n`)
  } catch (error) {
    console.error("❌ Failed to connect to Supabase:", error)
    process.exit(1)
  }

  // Verify environment variables
  console.log("🔍 Checking environment variables...")
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_SITE_URL",
  ]

  const missingVars = requiredVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error("❌ Missing environment variables:")
    missingVars.forEach((varName) => console.error(`   - ${varName}`))
    console.log("\n📝 Please add these to your .env.local file")
    process.exit(1)
  }

  console.log("✅ All required environment variables are set\n")

  // Display current configuration
  console.log("📋 Current Configuration:")
  console.log(`   Site URL: ${process.env.NEXT_PUBLIC_SITE_URL}`)
  console.log(`   Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}\n`)

  // Provide setup instructions
  console.log("📚 Next Steps:")
  console.log("1. Go to your Supabase Dashboard: https://supabase.com/dashboard")
  console.log("2. Navigate to Authentication > URL Configuration")
  console.log("3. Set your Site URL to:", process.env.NEXT_PUBLIC_SITE_URL)
  console.log("4. Add these Redirect URLs:")

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const redirectUrls = [`${siteUrl}/auth/callback`, `${siteUrl}/**`]

  redirectUrls.forEach((url) => console.log(`   - ${url}`))

  if (process.env.NODE_ENV === "production") {
    console.log("\n🔒 Production Environment Detected")
    console.log("Additional considerations:")
    console.log("- Ensure HTTPS is enabled")
    console.log("- Configure OAuth providers if needed")
    console.log("- Test email delivery")
    console.log("- Enable Row Level Security policies")
  }

  console.log("\n✨ Setup complete! Test your authentication flow.")
}

// Run the setup
setupAuthConfiguration().catch(console.error)
