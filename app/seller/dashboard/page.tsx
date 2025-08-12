import { createServerClient } from "@/lib/supabase-server"
import { SellerDashboard } from "@/components/seller/seller-dashboard"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getSellerData() {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return {
        organization: null,
        products: [],
        recentOrders: [],
        salesData: [],
        lowStockProducts: [],
      }
    }

    const supabase = createServerClient()

    if (!supabase) {
      return {
        organization: null,
        products: [],
        recentOrders: [],
        salesData: [],
        lowStockProducts: [],
      }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/seller/dashboard")
    }

    // Get seller's organization
    const { data: orgUser } = await supabase
      .from("organization_users")
      .select(`
        organization_id,
        role,
        organizations(*)
      `)
      .eq("user_id", user.id)
      .eq("role", "owner")
      .single()

    if (!orgUser) {
      redirect("/org/new?type=seller")
    }

    const orgId = orgUser.organization_id

    // Get seller's products
    const { data: products } = await supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, display_order),
        product_categories(name)
      `)
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false })

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          products(name, product_images(image_url, display_order))
        )
      `)
      .eq("vendor_organization_id", orgId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Get sales analytics (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: salesData } = await supabase
      .from("orders")
      .select("total_amount, created_at, status")
      .eq("vendor_organization_id", orgId)
      .gte("created_at", thirtyDaysAgo.toISOString())

    // Get low stock products
    const { data: lowStockProducts } = await supabase
      .from("products")
      .select("id, name, inventory_count")
      .eq("organization_id", orgId)
      .lte("inventory_count", 10)
      .eq("status", "active")

    return {
      organization: orgUser.organizations,
      products: products || [],
      recentOrders: recentOrders || [],
      salesData: salesData || [],
      lowStockProducts: lowStockProducts || [],
    }
  } catch (error) {
    console.error("Error fetching seller data:", error)
    return {
      organization: null,
      products: [],
      recentOrders: [],
      salesData: [],
      lowStockProducts: [],
    }
  }
}

export default async function SellerDashboardPage() {
  const data = await getSellerData()

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerDashboard data={data} />
    </div>
  )
}

export const metadata = {
  title: "Seller Dashboard - FluffyPet",
  description: "Manage your products, orders, and sales",
}
