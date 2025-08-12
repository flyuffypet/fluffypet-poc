import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { trackFunctionCall } from "../_shared/monitoring.ts"
import { env } from "https://deno.land/std@0.168.0/dotenv/mod.ts"

await env.load()

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
        // Test database connectivity
        const { data, error: dbError } = await supabase.from("conversations").select("count").limit(1).single()

        functionResult = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: "connected",
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
          database: "disconnected",
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
          case "create-conversation": {
            const { participantId, bookingId, title } = data

            if (!participantId) {
              throw new Error("participantId is required")
            }

            // Create conversation
            const { data: conversation, error: convError } = await supabase
              .from("conversations")
              .insert({
                id: crypto.randomUUID(),
                booking_id: bookingId,
                title: title || "New Conversation",
                created_by: user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (convError) throw convError

            // Add participants
            const participants = [
              {
                conversation_id: conversation.id,
                user_id: user.id,
                joined_at: new Date().toISOString(),
              },
              {
                conversation_id: conversation.id,
                user_id: participantId,
                joined_at: new Date().toISOString(),
              },
            ]

            const { error: participantError } = await supabase.from("conversation_participants").insert(participants)

            if (participantError) throw participantError

            functionResult = {
              success: true,
              conversation,
            }
            break
          }

          case "send-message": {
            const { conversationId, content, messageType = "text" } = data

            if (!conversationId || !content) {
              throw new Error("conversationId and content are required")
            }

            // Verify user is participant
            const { data: participant, error: participantError } = await supabase
              .from("conversation_participants")
              .select("*")
              .eq("conversation_id", conversationId)
              .eq("user_id", user.id)
              .single()

            if (participantError || !participant) {
              throw new Error("User is not a participant in this conversation")
            }

            // Send message
            const { data: message, error: messageError } = await supabase
              .from("messages")
              .insert({
                id: crypto.randomUUID(),
                conversation_id: conversationId,
                sender_id: user.id,
                content,
                message_type: messageType,
                created_at: new Date().toISOString(),
              })
              .select(`
                *,
                sender:users(id, full_name, avatar_url)
              `)
              .single()

            if (messageError) throw messageError

            // Update conversation last activity
            const { error: updateError } = await supabase
              .from("conversations")
              .update({
                updated_at: new Date().toISOString(),
                last_message_id: message.id,
              })
              .eq("id", conversationId)

            if (updateError) throw updateError

            functionResult = {
              success: true,
              message,
            }
            break
          }

          case "mark-as-read": {
            const { conversationId, messageId } = data

            if (!conversationId) {
              throw new Error("conversationId is required")
            }

            // Update read status
            const { error: readError } = await supabase
              .from("conversation_participants")
              .update({
                last_read_at: new Date().toISOString(),
                last_read_message_id: messageId,
              })
              .eq("conversation_id", conversationId)
              .eq("user_id", user.id)

            if (readError) throw readError

            functionResult = {
              success: true,
              message: "Marked as read",
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
          case "list-conversations": {
            const { data: conversations, error: listError } = await supabase
              .from("conversations")
              .select(`
                *,
                participants:conversation_participants(
                  user:users(id, full_name, avatar_url)
                ),
                last_message:messages(id, content, created_at, sender_id)
              `)
              .eq("conversation_participants.user_id", user.id)
              .order("updated_at", { ascending: false })

            if (listError) throw listError

            functionResult = {
              success: true,
              conversations: conversations || [],
            }
            break
          }

          case "get-messages": {
            const conversationId = url.searchParams.get("conversationId")
            const limit = Number.parseInt(url.searchParams.get("limit") || "50")
            const offset = Number.parseInt(url.searchParams.get("offset") || "0")

            if (!conversationId) {
              throw new Error("conversationId is required")
            }

            // Verify user is participant
            const { data: participant, error: participantError } = await supabase
              .from("conversation_participants")
              .select("*")
              .eq("conversation_id", conversationId)
              .eq("user_id", user.id)
              .single()

            if (participantError || !participant) {
              throw new Error("User is not a participant in this conversation")
            }

            // Get messages
            const { data: messages, error: messagesError } = await supabase
              .from("messages")
              .select(`
                *,
                sender:users(id, full_name, avatar_url)
              `)
              .eq("conversation_id", conversationId)
              .order("created_at", { ascending: false })
              .range(offset, offset + limit - 1)

            if (messagesError) throw messagesError

            functionResult = {
              success: true,
              messages: messages || [],
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
      function_name: "chat",
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
    console.error("Chat function error:", error)

    // Track failed function call
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await trackFunctionCall(supabase, {
        function_name: "chat",
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
