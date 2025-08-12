import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { fileName, fileType, bucket = "pet-media", folder } = await req.json()

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "fileName and fileType are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate unique filename
    const fileExt = fileName.split(".").pop()
    const uniqueFileName = `${user.id}/${folder || "general"}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Create signed upload URL using Supabase Storage
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(uniqueFileName)

    if (error) {
      return NextResponse.json({ error: `Failed to create upload URL: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      path: uniqueFileName,
      token: data.token,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
