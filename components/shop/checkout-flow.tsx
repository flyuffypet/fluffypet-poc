"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { MapPin, CreditCard } from "lucide-react"
import Image from "next/image"
import { AddressForm } from "./address-form"
import { createClient } from "@/lib/supabase-client"
import { createRazorpayOrder } from "@/lib/actions/payment-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface CheckoutFlowProps {
  data: {
    cartItems: any[]
    addresses: any[]
    shippingMethods: any[]
  }
}

export function CheckoutFlow({ data }: CheckoutFlowProps) {
  const { cartItems, addresses, shippingMethods } = data
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((a) => a.is_default)?.id || addresses[0]?.id || "",
  )
  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0]?.id || "")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.price_at_add || item.products.price
    const variantAdjustment = item.product_variants?.price_adjustment || 0
    return sum + (itemPrice + variantAdjustment) * item.quantity
  }, 0)

  const selectedShippingMethod = shippingMethods.find((s) => s.id === selectedShipping)
  const shippingCost = selectedShippingMethod?.price || 0
  const total = subtotal + shippingCost

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true)
      const script = document.createElement("script")
      script.id = "razorpay-script"
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address")
      return
    }

    if (!selectedShipping) {
      toast.error("Please select a shipping method")
      return
    }

    setIsProcessing(true)

    try {
      const supabase = createClient()

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error("Failed to load payment gateway")
      }

      const orderData = await createRazorpayOrder(total)

      // Get selected address
      const address = addresses.find((a) => a.id === selectedAddress)

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_amount: total,
          currency: "INR",
          status: "pending",
          shipping_address: address,
          billing_address: address,
          shipping_method_id: selectedShipping,
          shipping_cost: shippingCost,
          payment_gateway_reference: orderData.orderId,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.products.id,
        quantity: item.quantity,
        price_at_purchase: item.price_at_add || item.products.price,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
      if (itemsError) throw itemsError

      // Initialize Razorpay payment
      const options = {
        key: orderData.keyId, // Key comes from server action now
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FluffyPet",
        description: `Order #${order.id.slice(0, 8)}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Update order status
            await supabase
              .from("orders")
              .update({
                status: "confirmed",
                payment_gateway_reference: response.razorpay_payment_id,
              })
              .eq("id", order.id)

            // Clear cart
            await supabase
              .from("cart_items")
              .delete()
              .eq("user_id", (await supabase.auth.getUser()).data.user?.id)

            toast.success("Order placed successfully!")
            router.push(`/shop/orders/${order.id}`)
          } catch (error) {
            console.error("Payment confirmation error:", error)
            toast.error("Payment successful but order confirmation failed")
          }
        },
        prefill: {
          name: address?.name,
          email: (await supabase.auth.getUser()).data.user?.email,
          contact: address?.phone,
        },
        theme: { color: "#16a34a" },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast.error(error.message || "Failed to process order")
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">No addresses found. Please add a delivery address.</p>
                <Button onClick={() => setShowAddressForm(true)}>Add Address</Button>
              </div>
            ) : (
              <>
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  {addresses.map((address) => (
                    <div key={address.id} className="flex items-start space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                        <div className="font-medium">{address.name}</div>
                        <div className="text-sm text-gray-600">
                          {address.street_address}, {address.city}, {address.state} {address.postal_code}
                        </div>
                        {address.phone && <div className="text-sm text-gray-600">{address.phone}</div>}
                        {address.is_default && <div className="text-xs text-blue-600 mt-1">Default Address</div>}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <Button variant="outline" onClick={() => setShowAddressForm(true)} className="w-full">
                  Add New Address
                </Button>
              </>
            )}

            {showAddressForm && (
              <AddressForm
                onSuccess={() => {
                  setShowAddressForm(false)
                  window.location.reload()
                }}
                onCancel={() => setShowAddressForm(false)}
              />
            )}
          </CardContent>
        </Card>

        {/* Shipping Method */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
              {shippingMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="cursor-pointer">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                      {method.estimated_days_min && method.estimated_days_max && (
                        <div className="text-sm text-gray-500">
                          {method.estimated_days_min === method.estimated_days_max
                            ? `${method.estimated_days_min} day${method.estimated_days_min > 1 ? "s" : ""}`
                            : `${method.estimated_days_min}-${method.estimated_days_max} days`}
                        </div>
                      )}
                    </Label>
                  </div>
                  <div className="font-medium">{method.price === 0 ? "Free" : `₹${method.price}`}</div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="space-y-6">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => {
              const product = item.products
              const variant = item.product_variants
              const primaryImage =
                product.product_images?.find((img: any) => img.display_order === 0) || product.product_images?.[0]
              const itemPrice = item.price_at_add || product.price
              const variantAdjustment = variant?.price_adjustment || 0
              const finalPrice = itemPrice + variantAdjustment

              return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {primaryImage ? (
                      <Image
                        src={primaryImage.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">📦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{product.name}</div>
                    {variant && (
                      <div className="text-xs text-gray-500">
                        {variant.variant_type}: {variant.value}
                      </div>
                    )}
                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                  </div>

                  <div className="text-sm font-medium">₹{(finalPrice * item.quantity).toLocaleString()}</div>
                </div>
              )
            })}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString()}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Place Order */}
        <Button
          className="w-full"
          size="lg"
          onClick={handlePlaceOrder}
          disabled={isProcessing || !selectedAddress || !selectedShipping}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          {isProcessing ? "Processing..." : `Place Order - ₹${total.toLocaleString()}`}
        </Button>
      </div>
    </div>
  )
}
