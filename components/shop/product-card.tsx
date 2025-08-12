"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface ProductCardProps {
  product: {
    id: string
    name: string
    description?: string
    price: number
    currency: string
    inventory_count: number
    product_images?: Array<{
      image_url: string
      alt_text?: string
      display_order: number
    }>
    product_categories?: {
      name: string
    }
    organizations?: {
      name: string
      logo_url?: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const primaryImage = product.product_images?.find((img) => img.display_order === 0) || product.product_images?.[0]
  const isOutOfStock = product.inventory_count <= 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
          quantity: 1,
          price_at_add: product.price,
        },
        {
          onConflict: "user_id,product_id",
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

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

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
    <Link href={`/shop/products/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-200 h-full">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
            {primaryImage ? (
              <Image
                src={primaryImage.image_url || "/placeholder.svg"}
                alt={primaryImage.alt_text || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-12 h-12" />
              </div>
            )}

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleToggleWishlist}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            </Button>

            {/* Stock Badge */}
            {isOutOfStock && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            {/* Category */}
            {product.product_categories && (
              <Badge variant="secondary" className="text-xs">
                {product.product_categories.name}
              </Badge>
            )}

            {/* Product Name */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>

            {/* Seller */}
            {product.organizations && <p className="text-sm text-gray-600">by {product.organizations.name}</p>}

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">₹{product.price.toLocaleString()}</span>

              {/* Rating placeholder */}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isAddingToCart || isOutOfStock}
              variant={isOutOfStock ? "secondary" : "default"}
            >
              {isAddingToCart ? (
                "Adding..."
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
