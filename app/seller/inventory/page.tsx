import { createServerClient } from "@/lib/supabase-server"
import { InventoryManagement } from "@/components/seller/inventory-management"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getInventoryData() {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/seller/inventory")
    }

    // Get seller's organization
    const { data: orgUser } = await supabase
      .from("organization_users")
      .select("organization_id")
      .eq("user_id", user.id)
      .eq("role", "owner")
      .single()

    if (!orgUser) {
      redirect("/seller/dashboard")
    }

    // Get products with inventory data
    const { data: products } = await supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, display_order),
        product_categories(name),
        product_variants(id, name, value, inventory_count, sku)
      `)
      .eq("organization_id", orgUser.organization_id)
      .order("name")

    // Get recent inventory transactions
    const { data: transactions } = await supabase
      .from("inventory_transactions")
      .select(`
        *,
        inventory:products(name)
      `)
      .eq("organization_id", orgUser.organization_id)
      .order("created_at", { ascending: false })
      .limit(50)

    return {
      products: products || [],
      transactions: transactions || [],
      organizationId: orgUser.organization_id,
    }
  } catch (error) {
    console.error("Error fetching inventory data:", error)
    return {
      products: [],
      transactions: [],
      organizationId: null,
    }
  }
}

export default async function InventoryPage() {
  const data = await getInventoryData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
        <InventoryManagement data={data} />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Inventory Management - FluffyPet Seller",
  description: "Manage your product inventory and stock levels",
}
