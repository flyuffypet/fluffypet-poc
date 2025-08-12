import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { env } from "https://deno.land/std@0.168.0/dotenv/mod.ts"

await env.load()

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

    const { action, recipientId, conversationId, message, messageType } = await req.json()

    switch (action) {
      case "create-conversation": {
        // Check if conversation already exists
        const { data: existingConversation } = await supabaseClient
          .from("conversations")
          .select("*")
          .or(
            `and(user1_id.eq.${user.id},user2_id.eq.${recipientId}),and(user1_id.eq.${recipientId},user2_id.eq.${user.id})`,
          )
          .single()

        if (existingConversation) {
          return new Response(JSON.stringify({ conversation: existingConversation }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        // Create new conversation
        const { data, error } = await supabaseClient
          .from("conversations")
          .insert({
            user1_id: user.id,
            user2_id: recipientId,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        return new Response(JSON.stringify({ conversation: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "send-message": {
        const { data, error } = await supabaseClient
          .from("messages")
          .insert({
            conversation_id: conversationId,
            sender_id: user.id,
            content: message,
            message_type: messageType || "text",
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        // Update conversation last_message_at
        await supabaseClient
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId)

        return new Response(JSON.stringify({ message: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "mark-read": {
        const { error } = await supabaseClient
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
        const { data, error } = await supabaseClient
          .from("conversations")
          .select(`
            *,
            user1:users!conversations_user1_id_fkey(id, full_name, avatar_url),
            user2:users!conversations_user2_id_fkey(id, full_name, avatar_url),
            last_message:messages(content, created_at, sender_id)
          `)
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .order("last_message_at", { ascending: false })

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
