"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "./product-card"
import { CategoryGrid } from "./category-grid"

interface ShopHomeProps {
  data: {
    featuredProducts: any[]
    categories: any[]
    recentProducts: any[]
  }
}

export function ShopHome({ data }: ShopHomeProps) {
  const { featuredProducts, categories, recentProducts } = data

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold">Everything Your Pet Needs</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              Discover quality products from trusted sellers. Food, toys, accessories and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search for pet products..."
                  className="pl-12 pr-4 py-3 text-lg bg-white text-gray-900"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2">Search</Button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Free Shipping on ₹500+
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Trusted Sellers
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Quality Guaranteed
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Button variant="outline" asChild>
              <Link href="/shop/categories">View All</Link>
            </Button>
          </div>
          <CategoryGrid categories={categories} />
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Button variant="outline" asChild>
                <Link href="/shop/products?featured=true">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">New Arrivals</h2>
            <Button variant="outline" asChild>
              <Link href="/shop/products">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section>
          <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
              <p className="text-green-100 mb-4">
                Get exclusive deals, pet care tips, and connect with other pet parents
              </p>
              <Button variant="secondary" size="lg">
                Sign Up Now
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
