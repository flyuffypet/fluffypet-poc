"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { QuantitySelector } from "./quantity-selector"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface ShoppingCartProps {
  data: {
    cartItems: any[]
    addresses: any[]
  }
}

export function ShoppingCart({ data }: ShoppingCartProps) {
  const { cartItems: initialCartItems, addresses } = data
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const router = useRouter()

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const supabase = createClient()

    try {
      if (newQuantity === 0) {
        await removeItem(itemId)
        return
      }

      const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", itemId)

      if (error) throw error

      setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    } catch (error) {
      console.error("Update quantity error:", error)
      toast.error("Failed to update quantity")
    }
  }

  const removeItem = async (itemId: string) => {
    const supabase = createClient()

    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) throw error

      setCartItems((prev) => prev.filter((item) => item.id !== itemId))
      toast.success("Item removed from cart")
    } catch (error) {
      console.error("Remove item error:", error)
      toast.error("Failed to remove item")
    }
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    const supabase = createClient()

    try {
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .gte("valid_until", new Date().toISOString())
        .single()

      if (error || !coupon) {
        toast.error("Invalid or expired coupon code")
        return
      }

      if (subtotal < coupon.minimum_order_amount) {
        toast.error(`Minimum order amount is ₹${coupon.minimum_order_amount}`)
        return
      }

      setAppliedCoupon(coupon)
      toast.success("Coupon applied successfully!")
    } catch (error) {
      console.error("Apply coupon error:", error)
      toast.error("Failed to apply coupon")
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast.success("Coupon removed")
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.price_at_add || item.products.price
    const variantAdjustment = item.product_variants?.price_adjustment || 0
    return sum + (itemPrice + variantAdjustment) * item.quantity
  }, 0)

  const discountAmount = appliedCoupon
    ? appliedCoupon.discount_type === "percentage"
      ? Math.min(
          (subtotal * appliedCoupon.discount_value) / 100,
          appliedCoupon.maximum_discount_amount || Number.POSITIVE_INFINITY,
        )
      : appliedCoupon.discount_value
    : 0

  const shippingCost = subtotal >= 500 ? 0 : 50
  const total = subtotal - discountAmount + shippingCost

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Add some products to get started!</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => {
          const product = item.products
          const variant = item.product_variants
          const primaryImage =
            product.product_images?.find((img: any) => img.display_order === 0) || product.product_images?.[0]
          const itemPrice = item.price_at_add || product.price
          const variantAdjustment = variant?.price_adjustment || 0
          const finalPrice = itemPrice + variantAdjustment

          return (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url || "/placeholder.svg"}
                        alt={primaryImage.alt_text || product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-2xl">📦</div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/shop/products/${product.id}`} className="hover:text-blue-600">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600">{product.organizations?.name}</p>
                    {variant && (
                      <p className="text-sm text-gray-500">
                        {variant.variant_type}: {variant.name} - {variant.value}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(newQuantity) => updateQuantity(item.id, newQuantity)}
                          max={Math.min(variant?.inventory_count || product.inventory_count, 10)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">₹{(finalPrice * item.quantity).toLocaleString()}</div>
                        <div className="text-sm text-gray-500">₹{finalPrice.toLocaleString()} each</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        {/* Coupon Code */}
        <Card>
          <CardHeader>
            <CardTitle>Coupon Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <div className="font-medium text-green-800">{appliedCoupon.code}</div>
                  <div className="text-sm text-green-600">
                    {appliedCoupon.discount_type === "percentage"
                      ? `${appliedCoupon.discount_value}% off`
                      : `₹${appliedCoupon.discount_value} off`}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-green-700">
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <Button onClick={applyCoupon} disabled={isApplyingCoupon}>
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
            </div>

            {subtotal < 500 && (
              <div className="text-sm text-gray-600">
                Add ₹{(500 - subtotal).toLocaleString()} more for free shipping
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <Button className="w-full" size="lg" onClick={() => router.push("/shop/checkout")}>
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
