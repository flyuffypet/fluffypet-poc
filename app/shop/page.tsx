import { createServerClient } from "@/lib/supabase-server"
import { ShopHome } from "@/components/shop/shop-home"

export const dynamic = "force-dynamic"

async function getShopData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      featuredProducts: [],
      categories: [],
      recentProducts: [],
    }
  }

  try {
    const supabase = createServerClient()

    // Get featured products
    const { data: featuredProducts } = await supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, alt_text, display_order),
        product_categories(name),
        organizations(name, logo_url)
      `)
      .eq("status", "active")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(8)

    // Get product categories
    const { data: categories } = await supabase
      .from("product_categories")
      .select("*")
      .is("parent_category_id", null)
      .order("name")

    // Get recent products
    const { data: recentProducts } = await supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, alt_text, display_order),
        product_categories(name),
        organizations(name, logo_url)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(12)

    return {
      featuredProducts: featuredProducts || [],
      categories: categories || [],
      recentProducts: recentProducts || [],
    }
  } catch (error) {
    console.error("Error fetching shop data:", error)
    return {
      featuredProducts: [],
      categories: [],
      recentProducts: [],
    }
  }
}

export default async function ShopPage() {
  const data = await getShopData()

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHome data={data} />
    </div>
  )
}

export const metadata = {
  title: "Pet Products Shop - FluffyPet",
  description:
    "Discover quality pet products from trusted sellers. Food, toys, accessories and more for your furry friends.",
}
