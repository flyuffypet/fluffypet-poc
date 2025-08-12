import { createServerClient } from "@/lib/supabase-server"
import { OrderFulfillment } from "@/components/seller/order-fulfillment"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getOrdersData() {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/seller/orders")
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

    // Get orders for seller's products
    const { data: orders } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(
          *,
          products(
            id,
            name,
            price,
            product_images(image_url, display_order)
          )
        ),
        order_status_history(
          *,
          profiles(first_name, last_name)
        )
      `)
      .eq("vendor_organization_id", orgUser.organization_id)
      .order("created_at", { ascending: false })

    return {
      orders: orders || [],
      organizationId: orgUser.organization_id,
    }
  } catch (error) {
    console.error("Error fetching orders data:", error)
    return {
      orders: [],
      organizationId: null,
    }
  }
}

export default async function SellerOrdersPage() {
  const data = await getOrdersData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order Management</h1>
        <OrderFulfillment data={data} />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Order Management - FluffyPet Seller",
  description: "Manage and fulfill your orders",
}
