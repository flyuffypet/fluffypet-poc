import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const authHeader = req.headers.get("Authorization")
    if (!authHeader) throw new Error("No authorization header")

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""))

    if (authError || !user) throw new Error("Unauthorized")

    const {
      action,
      fileName,
      fileType,
      folder,
      filePath,
      expiresIn,
      petId,
      mediaType,
      description,
      storagePath,
      publicUrl,
    } = await req.json()

    switch (action) {
      case "generate-upload-url": {
        const path = folder ? `${folder}/${fileName}` : fileName

        const { data, error } = await supabaseClient.storage.from("media").createSignedUploadUrl(path)

        if (error) throw error

        return new Response(
          JSON.stringify({
            uploadUrl: data.signedUrl,
            path: path,
            token: data.token,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }

      case "create-signed-url": {
        const { data, error } = await supabaseClient.storage.from("media").createSignedUrl(filePath, expiresIn || 3600)

        if (error) throw error

        return new Response(JSON.stringify({ signedUrl: data.signedUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "delete-file": {
        const { error } = await supabaseClient.storage.from("media").remove([filePath])

        if (error) throw error

        return new Response(JSON.stringify({ message: "File deleted successfully" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "save-media-record": {
        const { data, error } = await supabaseClient
          .from("pet_media")
          .insert({
            pet_id: petId,
            user_id: user.id,
            media_type: mediaType,
            description: description,
            storage_path: storagePath,
            public_url: publicUrl,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ media: data }), {
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
