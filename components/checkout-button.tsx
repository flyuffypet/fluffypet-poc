"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createRazorpayOrder } from "@/lib/actions/payment-actions"
import { toast } from "sonner"

declare global {
  interface Window {
    Razorpay: any
  }
}

async function loadRazorpayScript() {
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

export default function CheckoutButton({ amountInINR = 49 }: { amountInINR?: number }) {
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    setLoading(true)
    try {
      const ok = await loadRazorpayScript()
      if (!ok) throw new Error("Failed to load Razorpay")

      const orderData = await createRazorpayOrder(amountInINR)

      const options = {
        key: orderData.keyId, // Key comes from server action now
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FluffyPet",
        description: "Test Transaction",
        order_id: orderData.orderId,
        handler: (response: any) => {
          toast.success(`Payment successful: ${response.razorpay_payment_id}`)
        },
        prefill: { name: "FluffyPet User", email: "user@example.com" },
        theme: { color: "#16a34a" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e: any) {
      toast.error(e.message || "Payment failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handlePay} disabled={loading}>
      {loading ? "Processing..." : `Pay ₹${amountInINR}`}
    </Button>
  )
}
