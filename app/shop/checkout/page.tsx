import { createServerClient } from "@/lib/supabase-server"
import { CheckoutFlow } from "@/components/shop/checkout-flow"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getCheckoutData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      cartItems: [],
      addresses: [],
      shippingMethods: [],
    }
  }

  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/shop/checkout")
    }

    // Get cart items
    const { data: cartItems } = await supabase
      .from("cart_items")
      .select(`
        *,
        products(
          id,
          name,
          price,
          currency,
          inventory_count,
          product_images(image_url, alt_text, display_order),
          organizations(id, name)
        ),
        product_variants(
          id,
          name,
          value,
          variant_type,
          price_adjustment,
          inventory_count
        )
      `)
      .eq("user_id", user.id)

    if (!cartItems || cartItems.length === 0) {
      redirect("/shop/cart")
    }

    // Get user's addresses
    const { data: addresses } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })

    // Get shipping methods
    const { data: shippingMethods } = await supabase
      .from("shipping_methods")
      .select("*")
      .eq("is_active", true)
      .order("price")

    return {
      cartItems,
      addresses: addresses || [],
      shippingMethods: shippingMethods || [],
    }
  } catch (error) {
    console.error("Error fetching checkout data:", error)
    return {
      cartItems: [],
      addresses: [],
      shippingMethods: [],
    }
  }
}

export default async function CheckoutPage() {
  const data = await getCheckoutData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <CheckoutFlow data={data} />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Checkout - FluffyPet",
  description: "Complete your order",
}
