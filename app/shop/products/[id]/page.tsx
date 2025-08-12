import { createServerClient } from "@/lib/supabase-server"
import { ProductDetail } from "@/components/shop/product-detail"
import { notFound } from "next/navigation"

async function getProductData(productId: string) {
  const supabase = createServerClient()

  // Get product with all related data
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_images(image_url, alt_text, display_order),
      product_categories(id, name, description),
      product_variants(id, name, value, variant_type, price_adjustment, inventory_count, sku),
      organizations(id, name, logo_url, description, address, phone, email)
    `)
    .eq("id", productId)
    .eq("status", "active")
    .single()

  if (!product) return null

  // Get product reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles(first_name, last_name, avatar_url)
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  // Get related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select(`
      *,
      product_images(image_url, alt_text, display_order),
      organizations(name)
    `)
    .eq("category_id", product.category_id)
    .eq("status", "active")
    .neq("id", productId)
    .limit(4)

  return {
    product,
    reviews: reviews || [],
    relatedProducts: relatedProducts || [],
  }
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await getProductData(params.id)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductDetail data={data} />
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  const supabase = createServerClient()
  const { data: product } = await supabase.from("products").select("name, description").eq("id", params.id).single()

  if (!product) {
    return {
      title: "Product Not Found - FluffyPet",
    }
  }

  return {
    title: `${product.name} - FluffyPet Shop`,
    description: product.description || `Buy ${product.name} from FluffyPet marketplace`,
  }
}
