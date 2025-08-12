import { NextResponse } from "next/server"
import { Novu } from "@novu/node"

export async function POST(req: Request) {
  try {
    const { subscriberId = "demo-user", payload = { message: "Hello from FluffyPet!" } } = await req.json()
    const novu = new Novu(process.env.NOVU_API_KEY!)
    // Trigger a simple event (ensure you have an event configured in Novu dashboard, e.g., "fluffypet-notify")
    const res = await novu.events.trigger("fluffypet-notify", {
      to: { subscriberId },
      payload,
    })
    return NextResponse.json(res)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
