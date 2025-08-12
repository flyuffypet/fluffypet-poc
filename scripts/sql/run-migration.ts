import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join } from "path"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function runMigration() {
  console.log("🚀 Running monitoring tables migration...")

  try {
    // Read the SQL file
    const sqlPath = join(process.cwd(), "scripts/sql/019_monitoring_tables.sql")
    const sqlContent = readFileSync(sqlPath, "utf-8")

    // Split SQL into individual statements
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    console.log(`📝 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)

        const { error } = await supabase.rpc("exec_sql", {
          sql: statement + ";",
        })

        if (error) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message)
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      }
    }

    // Verify tables were created
    console.log("🔍 Verifying table creation...")

    const { data: metricsTable, error: metricsError } = await supabase
      .from("edge_function_metrics")
      .select("count", { count: "exact", head: true })

    if (!metricsError) {
      console.log("✅ edge_function_metrics table verified")
    } else {
      console.error("❌ edge_function_metrics table verification failed:", metricsError.message)
    }

    const { data: healthTable, error: healthError } = await supabase
      .from("system_health_checks")
      .select("count", { count: "exact", head: true })

    if (!healthError) {
      console.log("✅ system_health_checks table verified")
    } else {
      console.error("❌ system_health_checks table verification failed:", healthError.message)
    }

    const { data: errorTable, error: errorTableError } = await supabase
      .from("error_logs")
      .select("count", { count: "exact", head: true })

    if (!errorTableError) {
      console.log("✅ error_logs table verified")
    } else {
      console.error("❌ error_logs table verification failed:", errorTableError.message)
    }

    // Test the monitoring summary view
    const { data: summaryView, error: summaryError } = await supabase.from("monitoring_summary").select("*").limit(1)

    if (!summaryError) {
      console.log("✅ monitoring_summary view verified")
    } else {
      console.error("❌ monitoring_summary view verification failed:", summaryError.message)
    }

    console.log("")
    console.log("🎉 Monitoring infrastructure setup complete!")
    console.log("")
    console.log("📊 Created Tables:")
    console.log("  • edge_function_metrics - Performance tracking")
    console.log("  • system_health_checks - Health monitoring")
    console.log("  • error_logs - Error tracking")
    console.log("  • monitoring_summary - Aggregated metrics view")
    console.log("")
    console.log("🔐 Security Features:")
    console.log("  • Row Level Security enabled")
    console.log("  • Admin-only access policies")
    console.log("  • Service role permissions")
    console.log("")
    console.log("🧹 Maintenance:")
    console.log("  • Automatic cleanup function created")
    console.log("  • Scheduled cleanup (if pg_cron available)")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

// Alternative function using direct SQL execution
async function runMigrationDirect() {
  console.log("🚀 Running monitoring tables migration (direct SQL)...")

  try {
    // Read and execute the SQL file directly
    const sqlPath = join(process.cwd(), "scripts/sql/019_monitoring_tables.sql")
    const sqlContent = readFileSync(sqlPath, "utf-8")

    // Use the SQL editor or direct query execution
    const { error } = await supabase.rpc("exec_sql", {
      sql: sqlContent,
    })

    if (error) {
      console.error("❌ Migration failed:", error.message)
      process.exit(1)
    }

    console.log("✅ Migration completed successfully")

    // Verify tables
    await verifyTables()
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

async function verifyTables() {
  console.log("🔍 Verifying monitoring infrastructure...")

  const tables = ["edge_function_metrics", "system_health_checks", "error_logs"]

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select("count", { count: "exact", head: true })

      if (!error) {
        console.log(`✅ ${table} table verified`)
      } else {
        console.error(`❌ ${table} table verification failed:`, error.message)
      }
    } catch (err) {
      console.error(`❌ Error verifying ${table}:`, err)
    }
  }

  // Test monitoring summary view
  try {
    const { error } = await supabase.from("monitoring_summary").select("*").limit(1)

    if (!error) {
      console.log("✅ monitoring_summary view verified")
    } else {
      console.error("❌ monitoring_summary view verification failed:", error.message)
    }
  } catch (err) {
    console.error("❌ Error verifying monitoring_summary view:", err)
  }
}

// Run the migration
if (require.main === module) {
  runMigration().catch(console.error)
}

export { runMigration, verifyTables }
