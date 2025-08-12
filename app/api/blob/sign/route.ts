import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { path, bucket = "media", expiresIn = 3600 } = await req.json()

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create signed URL for download
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

    if (error) {
      return NextResponse.json({ error: `Failed to create signed URL: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
