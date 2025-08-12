import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { trackFunctionCall } from "../_shared/monitoring.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const startTime = Date.now()
  let functionResult: any = null
  let error: Error | null = null

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const url = new URL(req.url)
    const path = url.pathname.split("/").pop()

    // Health check endpoint
    if (path === "health") {
      try {
        // Test storage connectivity
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
        if (storageError) throw storageError

        // Test database connectivity
        const { data, error: dbError } = await supabase.from("media").select("count").limit(1).single()

        functionResult = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          storage: "connected",
          database: "connected",
          buckets: buckets?.length || 0,
          responseTime: Date.now() - startTime,
        }

        return new Response(JSON.stringify(functionResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        })
      } catch (healthError) {
        error = healthError as Error
        functionResult = {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          error: error.message,
        }

        return new Response(JSON.stringify(functionResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        })
      }
    }

    const { method } = req
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      throw new Error("Authorization header required")
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error("Invalid authentication token")
    }

    switch (method) {
      case "POST": {
        const body = await req.json()
        const { action, ...data } = body

        switch (action) {
          case "generate-upload-url": {
            const { fileName, fileType, petId } = data

            if (!fileName || !fileType) {
              throw new Error("fileName and fileType are required")
            }

            // Generate unique file path
            const fileExt = fileName.split(".").pop()
            const uniqueFileName = `${user.id}/${petId || "general"}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

            // Generate signed upload URL
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("media")
              .createSignedUploadUrl(uniqueFileName)

            if (uploadError) throw uploadError

            // Create media record
            const { data: mediaRecord, error: mediaError } = await supabase
              .from("media")
              .insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                pet_id: petId,
                file_name: fileName,
                file_path: uniqueFileName,
                file_type: fileType,
                file_size: data.fileSize || null,
                upload_status: "pending",
                created_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (mediaError) throw mediaError

            functionResult = {
              success: true,
              uploadUrl: uploadData.signedUrl,
              mediaId: mediaRecord.id,
              filePath: uniqueFileName,
            }
            break
          }

          case "generate-signed-url": {
            const { filePath, expiresIn = 3600 } = data

            if (!filePath) {
              throw new Error("filePath is required")
            }

            const { data: signedUrl, error: signError } = await supabase.storage
              .from("media")
              .createSignedUrl(filePath, expiresIn)

            if (signError) throw signError

            functionResult = {
              success: true,
              signedUrl: signedUrl.signedUrl,
              expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
            }
            break
          }

          case "confirm-upload": {
            const { mediaId, metadata } = data

            if (!mediaId) {
              throw new Error("mediaId is required")
            }

            // Update media record
            const { data: updatedMedia, error: updateError } = await supabase
              .from("media")
              .update({
                upload_status: "completed",
                metadata: metadata || {},
                updated_at: new Date().toISOString(),
              })
              .eq("id", mediaId)
              .eq("user_id", user.id)
              .select()
              .single()

            if (updateError) throw updateError

            functionResult = {
              success: true,
              media: updatedMedia,
            }
            break
          }

          case "delete-file": {
            const { filePath, mediaId } = data

            if (!filePath) {
              throw new Error("filePath is required")
            }

            // Delete from storage
            const { error: deleteError } = await supabase.storage.from("media").remove([filePath])

            if (deleteError) throw deleteError

            // Delete media record if mediaId provided
            if (mediaId) {
              const { error: recordError } = await supabase
                .from("media")
                .delete()
                .eq("id", mediaId)
                .eq("user_id", user.id)

              if (recordError) throw recordError
            }

            functionResult = {
              success: true,
              message: "File deleted successfully",
            }
            break
          }

          default:
            throw new Error(`Unknown action: ${action}`)
        }
        break
      }

      case "GET": {
        const url = new URL(req.url)
        const action = url.searchParams.get("action")

        switch (action) {
          case "list-media": {
            const petId = url.searchParams.get("petId")

            let query = supabase
              .from("media")
              .select("*")
              .eq("user_id", user.id)
              .eq("upload_status", "completed")
              .order("created_at", { ascending: false })

            if (petId) {
              query = query.eq("pet_id", petId)
            }

            const { data: mediaList, error: listError } = await query

            if (listError) throw listError

            functionResult = {
              success: true,
              media: mediaList || [],
            }
            break
          }

          default:
            throw new Error(`Unknown action: ${action}`)
        }
        break
      }

      default:
        throw new Error(`Method ${method} not allowed`)
    }

    // Track successful function call
    await trackFunctionCall(supabase, {
      function_name: "media",
      user_id: user.id,
      action: req.method,
      success: true,
      response_time: Date.now() - startTime,
      metadata: {
        path,
        action: req.method === "POST" ? (await req.clone().json()).action : url.searchParams.get("action"),
      },
    })

    return new Response(JSON.stringify(functionResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    error = err as Error
    console.error("Media function error:", error)

    // Track failed function call
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await trackFunctionCall(supabase, {
        function_name: "media",
        user_id: null,
        action: req.method,
        success: false,
        response_time: Date.now() - startTime,
        error_message: error.message,
        metadata: { error: error.stack },
      })
    } catch (trackingError) {
      console.error("Failed to track error:", trackingError)
    }

    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
