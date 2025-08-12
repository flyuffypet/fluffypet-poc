import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const { fileName, fileType, bucket = "media", folder } = await req.json()

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "fileName and fileType are required" }, { status: 400 })
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

    // Generate unique filename
    const fileExt = fileName.split(".").pop()
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName

    // Create signed upload URL
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath)

    if (error) {
      return NextResponse.json({ error: `Failed to create upload URL: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({
      uploadUrl: data.signedUrl,
      path: filePath,
      token: data.token,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
