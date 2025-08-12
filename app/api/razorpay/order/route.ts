import { NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: Request) {
  try {
    const { amountInINR = 49 } = await req.json()
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await instance.orders.create({
      amount: Math.round(amountInINR * 100), // in paise
      currency: "INR",
      receipt: `fluffypet_${Date.now()}`,
    })

    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
