import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { Deno } from "https://deno.land/std@0.168.0/node/deno.ts"

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
      case "create-conversation": {
        const { participantId, type = "direct", contextId } = body

        // Check if conversation already exists
        const { data: existing } = await supabase
          .from("conversations")
          .select("id")
          .or(
            `and(user1_id.eq.${user.id},user2_id.eq.${participantId}),and(user1_id.eq.${participantId},user2_id.eq.${user.id})`,
          )
          .eq("type", type)
          .maybeSingle()

        if (existing) {
          return new Response(JSON.stringify({ conversationId: existing.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        // Create new conversation
        const { data, error } = await supabase
          .from("conversations")
          .insert({
            user1_id: user.id,
            user2_id: participantId,
            type,
            context_id: contextId,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ conversationId: data.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "send-message": {
        const { conversationId, content, messageType = "text" } = body

        const { data, error } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content,
            message_type: messageType,
            sent_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ message: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "get-messages": {
        const { conversationId, limit = 50, offset = 0 } = body

        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            sender:users!sender_id(id, full_name, avatar_url)
          `)
          .eq("conversation_id", conversationId)
          .order("sent_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) throw error

        return new Response(JSON.stringify({ messages: data.reverse() }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "mark-as-read": {
        const { conversationId } = body

        const { error } = await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .eq("conversation_id", conversationId)
          .neq("sender_id", user.id)
          .is("read_at", null)

        if (error) throw error

        return new Response(JSON.stringify({ message: "Messages marked as read" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "get-conversations": {
        const { limit = 20, offset = 0 } = body

        const { data, error } = await supabase
          .from("conversations")
          .select(`
            *,
            user1:users!user1_id(id, full_name, avatar_url),
            user2:users!user2_id(id, full_name, avatar_url),
            last_message:messages(content, sent_at, sender_id)
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order("updated_at", { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) throw error

        return new Response(JSON.stringify({ conversations: data }), {
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
