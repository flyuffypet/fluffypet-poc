import { createServerClient } from "@/lib/supabase-server"
import { CategoryListing } from "@/components/shop/category-listing"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

async function getCategoryData(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { category: null, products: [] }
  }

  try {
    const supabase = createServerClient()

    // Get category by slug
    const { data: category } = await supabase.from("product_categories").select("*").eq("slug", slug).single()

    if (!category) {
      return { category: null, products: [] }
    }

    // Get products in this category
    const { data: products } = await supabase
      .from("products")
      .select(`
        *,
        product_images(image_url, alt_text, display_order),
        product_categories!inner(name, slug),
        organizations(name, logo_url)
      `)
      .eq("status", "active")
      .eq("product_categories.id", category.id)
      .order("created_at", { ascending: false })

    return {
      category,
      products: products || [],
    }
  } catch (error) {
    console.error("Error fetching category data:", error)
    return { category: null, products: [] }
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { category, products } = await getCategoryData(params.slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && <p className="text-gray-600">{category.description}</p>}
        </div>
      </div>

      <CategoryListing category={category} products={products} />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { category } = await getCategoryData(params.slug)

  if (!category) {
    return {
      title: "Category Not Found - FluffyPet",
    }
  }

  return {
    title: `${category.name} - FluffyPet Shop`,
    description: category.description || `Shop ${category.name} products for your pets`,
  }
}
