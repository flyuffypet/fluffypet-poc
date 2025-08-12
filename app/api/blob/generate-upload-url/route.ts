import { NextResponse } from "next/server"
import { handleUpload } from "@vercel/blob/client"

export async function POST(request: Request) {
  try {
    const jsonResponse = await handleUpload({
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Add any validation logic here if needed
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB limit
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Handle upload completion if needed
        console.log("Upload completed:", blob.url)
      },
    })

    return jsonResponse
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
