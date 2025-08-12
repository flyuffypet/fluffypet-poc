import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const authHeader = req.headers.get("Authorization")!
    const token = authHeader.replace("Bearer ", "")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)
    if (authError || !user) throw new Error("Unauthorized")

    const { action, ...body } = await req.json()

    switch (action) {
      case "generate-upload-url": {
        const { fileName, fileType, bucket = "media", folder } = body

        if (!fileName || !fileType) {
          throw new Error("fileName and fileType are required")
        }

        // Generate unique filename
        const fileExt = fileName.split(".").pop()
        const uniqueFileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`
        const filePath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName

        const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(filePath)

        if (error) throw error

        return new Response(
          JSON.stringify({
            uploadUrl: data.signedUrl,
            path: filePath,
            token: data.token,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
      }

      case "create-signed-url": {
        const { path, bucket = "media", expiresIn = 3600 } = body

        if (!path) throw new Error("path is required")

        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

        if (error) throw error

        return new Response(JSON.stringify({ signedUrl: data.signedUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "save-media-record": {
        const { petId, type, filename, path, mimeType, size, metadata } = body

        const { data, error } = await supabase
          .from("pet_media")
          .insert({
            pet_id: petId,
            uploader_id: user.id,
            type,
            filename,
            path,
            mime_type: mimeType,
            size,
            metadata: metadata || {},
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ media: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "delete-media": {
        const { mediaId, path, bucket = "media" } = body

        // Delete from database
        const { error: dbError } = await supabase
          .from("pet_media")
          .delete()
          .eq("id", mediaId)
          .eq("uploader_id", user.id)

        if (dbError) throw dbError

        // Delete from storage
        const { error: storageError } = await supabase.storage.from(bucket).remove([path])

        if (storageError) {
          console.warn("Storage deletion failed:", storageError)
        }

        return new Response(JSON.stringify({ message: "Media deleted successfully" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      default:
        throw new Error("Invalid action")
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
