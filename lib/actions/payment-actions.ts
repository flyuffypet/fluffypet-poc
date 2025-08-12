"use server"

import { createServerClient } from "@/lib/supabase-server"

export async function getRazorpayConfig() {
  // Only return the key if user is authenticated
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  return {
    keyId: process.env.RAZORPAY_KEY_ID, // Use non-public env var
    // Don't expose the actual key, just return what's needed for client
  }
}

export async function createRazorpayOrder(amountInINR: number) {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  // Create order via existing API route
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/razorpay/order`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ amountInINR }),
  })

  if (!response.ok) {
    throw new Error("Failed to create payment order")
  }

  const order = await response.json()

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID, // Return key securely from server
  }
}
