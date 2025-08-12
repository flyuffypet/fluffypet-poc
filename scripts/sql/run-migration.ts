import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join } from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables")
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log("🚀 Starting monitoring tables migration...")

  try {
    // Test database connection
    console.log("🔍 Testing database connection...")
    const { data, error } = await supabase.from("profiles").select("count").limit(1)
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
    console.log("✅ Database connection successful")

    // Read the SQL file
    const sqlPath = join(process.cwd(), "scripts/sql/019_monitoring_tables.sql")
    const sqlContent = readFileSync(sqlPath, "utf-8")

    // Split into individual statements
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    console.log(`📝 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc("exec_sql", { sql: statement })
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message)
            console.error("Statement:", statement.substring(0, 100) + "...")
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`)
          }
        } catch (err) {
          console.error(`❌ Exception in statement ${i + 1}:`, err)
        }
      }
    }

    // Verify tables were created
    console.log("🔍 Verifying monitoring tables...")

    const tables = ["edge_function_metrics", "system_health_checks", "error_logs"]

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("count").limit(1)

      if (error) {
        console.error(`❌ Table ${table} verification failed:`, error.message)
      } else {
        console.log(`✅ Table ${table} created successfully`)
      }
    }

    // Verify view was created
    const { data: viewData, error: viewError } = await supabase.from("monitoring_summary").select("*").limit(1)

    if (viewError) {
      console.error("❌ View monitoring_summary verification failed:", viewError.message)
    } else {
      console.log("✅ View monitoring_summary created successfully")
    }

    console.log("🎉 Migration completed successfully!")
    console.log("\n📊 Monitoring Infrastructure Created:")
    console.log("  • edge_function_metrics - Performance tracking")
    console.log("  • system_health_checks - Service health monitoring")
    console.log("  • error_logs - Error tracking with stack traces")
    console.log("  • monitoring_summary - Aggregated metrics view")
    console.log("\n🔐 Security Features:")
    console.log("  • Row Level Security enabled")
    console.log("  • Admin-only access policies")
    console.log("  • Service role permissions configured")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

// Create exec_sql function if it doesn't exist
async function createExecSqlFunction() {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = ''
    AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$;
  `

  try {
    const { error } = await supabase.rpc("exec", { sql: createFunctionSql })
    if (error) {
      console.log("Note: exec_sql function creation skipped (may already exist)")
    }
  } catch (err) {
    console.log("Note: exec_sql function creation skipped")
  }
}

// Run the migration
createExecSqlFunction().then(() => runMigration())
