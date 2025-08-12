"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import { ProductGallery } from "./product-gallery"
import { ProductReviews } from "./product-reviews"
import { ProductCard } from "./product-card"
import { QuantitySelector } from "./quantity-selector"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface ProductDetailProps {
  data: {
    product: any
    reviews: any[]
    relatedProducts: any[]
  }
}

export function ProductDetail({ data }: ProductDetailProps) {
  const { product, reviews, relatedProducts } = data
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const variants = product.product_variants || []
  const images = product.product_images || []
  const avgRating = reviews.length > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length : 0

  const selectedVariantData = variants.find((v: any) => v.id === selectedVariant)
  const currentPrice = product.price + (selectedVariantData?.price_adjustment || 0)
  const currentStock = selectedVariantData?.inventory_count || product.inventory_count
  const isOutOfStock = currentStock <= 0

  const handleAddToCart = async () => {
    if (isOutOfStock) return

    setIsAddingToCart(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to add items to cart")
        return
      }

      // Get or create cart
      let { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).single()

      if (!cart) {
        const { data: newCart, error: cartError } = await supabase
          .from("carts")
          .insert({ user_id: user.id })
          .select("id")
          .single()

        if (cartError) throw cartError
        cart = newCart
      }

      // Add item to cart
      const { error } = await supabase.from("cart_items").upsert(
        {
          user_id: user.id,
          product_id: product.id,
          variant_id: selectedVariant || null,
          quantity,
          price_at_add: currentPrice,
        },
        {
          onConflict: "user_id,product_id,variant_id",
        },
      )

      if (error) throw error

      toast.success("Added to cart!")
    } catch (error) {
      console.error("Add to cart error:", error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Please sign in to save items")
      return
    }

    try {
      if (isWishlisted) {
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", product.id)
        setIsWishlisted(false)
        toast.success("Removed from wishlist")
      } else {
        await supabase.from("wishlists").insert({
          user_id: user.id,
          product_id: product.id,
        })
        setIsWishlisted(true)
        toast.success("Added to wishlist")
      }
    } catch (error) {
      console.error("Wishlist error:", error)
      toast.error("Failed to update wishlist")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Category & Brand */}
          <div className="flex items-center gap-2">
            {product.product_categories && <Badge variant="secondary">{product.product_categories.name}</Badge>}
            {product.organizations && <span className="text-sm text-gray-600">by {product.organizations.name}</span>}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {avgRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-600">₹{currentPrice.toLocaleString()}</div>
            {selectedVariantData?.price_adjustment !== 0 && (
              <div className="text-sm text-gray-500">
                Base price: ₹{product.price.toLocaleString()}
                {selectedVariantData?.price_adjustment > 0 && (
                  <span className="text-green-600"> (+₹{selectedVariantData.price_adjustment})</span>
                )}
              </div>
            )}
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Options:</h3>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name} - {variant.value}
                      {variant.price_adjustment !== 0 && (
                        <span className="ml-2 text-gray-500">
                          ({variant.price_adjustment > 0 ? "+" : ""}₹{variant.price_adjustment})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Quantity & Stock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Quantity:</h3>
              <span className="text-sm text-gray-600">
                {currentStock > 0 ? `${currentStock} in stock` : "Out of stock"}
              </span>
            </div>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={Math.min(currentStock, 10)}
              disabled={isOutOfStock}
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}>
              {isAddingToCart ? (
                "Adding to Cart..."
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - ₹{(currentPrice * quantity).toLocaleString()}
                </>
              )}
            </Button>

            <Button variant="outline" className="w-full bg-transparent" onClick={handleToggleWishlist}>
              <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-gray-500">On orders ₹500+</div>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Quality Assured</div>
              <div className="text-xs text-gray-500">Trusted sellers</div>
            </div>
            <div className="text-center">
              <RotateCcw className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Easy Returns</div>
              <div className="text-xs text-gray-500">7-day policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="seller">Seller Info</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                {product.description ? (
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ProductReviews reviews={reviews} productId={product.id} />
        </TabsContent>

        <TabsContent value="seller" className="mt-6">
          {product.organizations && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {product.organizations.logo_url && (
                    <Image
                      src={product.organizations.logo_url || "/placeholder.svg"}
                      alt={product.organizations.name}
                      width={64}
                      height={64}
                      className="rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{product.organizations.name}</h3>
                    {product.organizations.description && (
                      <p className="text-gray-600 mb-4">{product.organizations.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      {product.organizations.address && (
                        <div>
                          <span className="font-medium">Address:</span> {product.organizations.address}
                        </div>
                      )}
                      {product.organizations.phone && (
                        <div>
                          <span className="font-medium">Phone:</span> {product.organizations.phone}
                        </div>
                      )}
                      {product.organizations.email && (
                        <div>
                          <span className="font-medium">Email:</span> {product.organizations.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
