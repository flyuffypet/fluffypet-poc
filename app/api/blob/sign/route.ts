import { NextResponse } from "next/server"
import { getDownloadUrl } from "@vercel/blob"

// Signs a given Blob URL for temporary, permissioned access.
export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 })

    // In a real app, validate that the requester is allowed to see this media (via Supabase auth/ACL).
    // For PoC, we sign directly.
    const { url: signed } = await getDownloadUrl(url)
    return NextResponse.json({ url: signed })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
