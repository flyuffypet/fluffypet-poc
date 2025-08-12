"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List, Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CategoryListingProps {
  category: {
    id: string
    name: string
    description?: string
    slug: string
  }
  products: any[]
}

export function CategoryListing({ category, products }: CategoryListingProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-500" && product.price < 500) ||
        (priceRange === "500-1000" && product.price >= 500 && product.price <= 1000) ||
        (priceRange === "1000-2000" && product.price >= 1000 && product.price <= 2000) ||
        (priceRange === "over-2000" && product.price > 2000)

      return matchesSearch && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={`Search ${category.name.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white rounded-lg border">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-500">Under ₹500</SelectItem>
                <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                <SelectItem value="over-2000">Over ₹2,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const primaryImage =
              product.product_images?.find((img: any) => img.display_order === 0) || product.product_images?.[0]

            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.image_url || "/placeholder.svg"}
                      alt={primaryImage.alt_text || product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-4xl">📦</div>
                    </div>
                  )}
                  {product.is_featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-orange-500">Featured</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Link href={`/shop/p/${product.id}`} className="hover:text-blue-600">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    </Link>

                    <p className="text-sm text-gray-600">{product.organizations?.name}</p>

                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(4.2)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-lg">₹{product.price.toLocaleString()}</div>
                      <Button size="sm" variant="outline">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => {
            const primaryImage =
              product.product_images?.find((img: any) => img.display_order === 0) || product.product_images?.[0]

            return (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url || "/placeholder.svg"}
                          alt={primaryImage.alt_text || product.name}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-4xl">📦</div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/shop/p/${product.id}`} className="hover:text-blue-600">
                            <h3 className="text-xl font-semibold">{product.name}</h3>
                          </Link>
                          <p className="text-gray-600">{product.organizations?.name}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">₹{product.price.toLocaleString()}</div>
                          {product.is_featured && <Badge className="bg-orange-500 mt-1">Featured</Badge>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">(4.2)</span>
                      </div>

                      {product.description && <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {product.inventory_count > 0 ? `${product.inventory_count} in stock` : "Out of stock"}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" asChild>
                            <Link href={`/shop/p/${product.id}`}>View Details</Link>
                          </Button>
                          <Button disabled={product.inventory_count === 0}>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
