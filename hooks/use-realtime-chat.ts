"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase-client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_avatar?: string
  content: string
  message_type: "text" | "image" | "file"
  media_url?: string
  created_at: string
  is_read: boolean
  read_at?: string
}

export interface UseRealtimeChatProps {
  conversationId?: string
  otherUserId?: string
  currentUserId: string
  bookingId?: string
  appointmentId?: string
}

export function useRealtimeChat({
  conversationId,
  otherUserId,
  currentUserId,
  bookingId,
  appointmentId,
}: UseRealtimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [isTyping, setIsTyping] = useState<{ [userId: string]: boolean }>({})
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversationId || null)

  const supabase = createClient()

  // Get or create conversation
  const initializeConversation = useCallback(async () => {
    if (activeConversationId) return activeConversationId

    try {
      let conversationId: string

      if (bookingId) {
        // Create or get booking conversation
        const { data, error } = await supabase.rpc("create_booking_conversation", {
          p_booking_id: bookingId,
        })
        if (error) throw error
        conversationId = data
      } else if (appointmentId) {
        // Create or get appointment conversation
        const { data, error } = await supabase.rpc("create_appointment_conversation", {
          p_appointment_id: appointmentId,
        })
        if (error) throw error
        conversationId = data
      } else if (otherUserId) {
        // Create or get direct message conversation
        const { data, error } = await supabase.rpc("get_or_create_conversation", {
          user1_id: currentUserId,
          user2_id: otherUserId,
        })
        if (error) throw error
        conversationId = data
      } else {
        throw new Error("No conversation context provided")
      }

      setActiveConversationId(conversationId)
      return conversationId
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }, [activeConversationId, bookingId, appointmentId, otherUserId, currentUserId, supabase])

  // Load initial messages
  const loadMessages = useCallback(
    async (convId: string) => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("messages")
          .select(`
            id,
            conversation_id,
            sender_id,
            content,
            message_type,
            media_url,
            created_at,
            is_read,
            read_at,
            sender:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
          `)
          .eq("conversation_id", convId)
          .order("created_at", { ascending: true })

        if (error) throw error

        const formattedMessages: ChatMessage[] = (data || []).map((msg: any) => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender_id: msg.sender_id,
          sender_name: `${msg.sender?.first_name || ""} ${msg.sender?.last_name || ""}`.trim() || "Unknown User",
          sender_avatar: msg.sender?.avatar_url,
          content: msg.content,
          message_type: msg.message_type,
          media_url: msg.media_url,
          created_at: msg.created_at,
          is_read: msg.is_read,
          read_at: msg.read_at,
        }))

        setMessages(formattedMessages)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [supabase],
  )

  // Send a message
  const sendMessage = useCallback(
    async (content: string, messageType: "text" | "image" | "file" = "text", mediaUrl?: string) => {
      if (!activeConversationId) {
        const convId = await initializeConversation()
        if (!convId) return
      }

      try {
        const { error } = await supabase.from("messages").insert({
          conversation_id: activeConversationId,
          sender_id: currentUserId,
          content,
          message_type: messageType,
          media_url: mediaUrl,
        })

        if (error) throw error
      } catch (err: any) {
        setError(err.message)
      }
    },
    [activeConversationId, currentUserId, supabase, initializeConversation],
  )

  // Mark messages as read
  const markAsRead = useCallback(
    async (messageIds: string[]) => {
      try {
        const { error } = await supabase
          .from("messages")
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in("id", messageIds)
          .neq("sender_id", currentUserId)

        if (error) throw error
      } catch (err: any) {
        setError(err.message)
      }
    },
    [currentUserId, supabase],
  )

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (channel) {
        channel.send({
          type: "broadcast",
          event: "typing",
          payload: { user_id: currentUserId, is_typing: isTyping },
        })
      }
    },
    [channel, currentUserId],
  )

  // Set up realtime subscription
  useEffect(() => {
    let chatChannel: RealtimeChannel | null = null

    const setupChat = async () => {
      const convId = await initializeConversation()
      if (!convId) return

      chatChannel = supabase
        .channel(`chat:${convId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${convId}`,
          },
          async (payload) => {
            // Fetch the complete message with sender info
            const { data } = await supabase
              .from("messages")
              .select(`
                id,
                conversation_id,
                sender_id,
                content,
                message_type,
                media_url,
                created_at,
                is_read,
                read_at,
                sender:profiles!messages_sender_id_fkey(first_name, last_name, avatar_url)
              `)
              .eq("id", payload.new.id)
              .single()

            if (data) {
              const newMessage: ChatMessage = {
                id: data.id,
                conversation_id: data.conversation_id,
                sender_id: data.sender_id,
                sender_name:
                  `${data.sender?.first_name || ""} ${data.sender?.last_name || ""}`.trim() || "Unknown User",
                sender_avatar: data.sender?.avatar_url,
                content: data.content,
                message_type: data.message_type,
                media_url: data.media_url,
                created_at: data.created_at,
                is_read: data.is_read,
                read_at: data.read_at,
              }

              setMessages((prev) => [...prev, newMessage])
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${convId}`,
          },
          (payload) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === payload.new.id
                  ? { ...msg, is_read: payload.new.is_read, read_at: payload.new.read_at }
                  : msg,
              ),
            )
          },
        )
        .on("broadcast", { event: "typing" }, (payload) => {
          const { user_id, is_typing } = payload.payload
          if (user_id !== currentUserId) {
            setIsTyping((prev) => ({ ...prev, [user_id]: is_typing }))

            // Clear typing indicator after 3 seconds
            if (is_typing) {
              setTimeout(() => {
                setIsTyping((prev) => ({ ...prev, [user_id]: false }))
              }, 3000)
            }
          }
        })
        .subscribe()

      setChannel(chatChannel)

      // Load initial messages
      await loadMessages(convId)
    }

    setupChat()

    return () => {
      if (chatChannel) {
        supabase.removeChannel(chatChannel)
      }
    }
  }, [currentUserId, supabase, loadMessages, initializeConversation])

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    sendTypingIndicator,
    isTyping,
    conversationId: activeConversationId,
    refetch: () => activeConversationId && loadMessages(activeConversationId),
  }
}
