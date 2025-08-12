import { createServerClient } from "@/lib/supabase-server"
import { ShoppingCart } from "@/components/shop/shopping-cart"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

async function getCartData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      cartItems: [],
      addresses: [],
    }
  }

  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/shop/cart")
    }

    // Get cart items with product details
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
          organizations(name)
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
      .order("created_at", { ascending: false })

    // Get user's addresses
    const { data: addresses } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })

    return {
      cartItems: cartItems || [],
      addresses: addresses || [],
    }
  } catch (error) {
    console.error("Error fetching cart data:", error)
    return {
      cartItems: [],
      addresses: [],
    }
  }
}

export default async function CartPage() {
  const data = await getCartData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <ShoppingCart data={data} />
      </div>
    </div>
  )
}

export const metadata = {
  title: "Shopping Cart - FluffyPet",
  description: "Review your items and proceed to checkout",
}
