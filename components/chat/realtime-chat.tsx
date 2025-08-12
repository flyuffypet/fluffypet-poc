"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ImageIcon, Paperclip } from "lucide-react"
import { useRealtimeChat, type ChatMessage } from "@/hooks/use-realtime-chat"
import { formatDistanceToNow } from "date-fns"

interface RealtimeChatProps {
  conversationId?: string
  otherUserId?: string
  currentUserId: string
  currentUserName: string
  currentUserAvatar?: string
  otherUserName: string
  bookingId?: string
  appointmentId?: string
  title?: string
}

export default function RealtimeChat({
  conversationId,
  otherUserId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  otherUserName,
  bookingId,
  appointmentId,
  title,
}: RealtimeChatProps) {
  const [inputValue, setInputValue] = useState("")
  const [isTypingIndicator, setIsTypingIndicator] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  const { messages, loading, error, sendMessage, markAsRead, sendTypingIndicator, isTyping } = useRealtimeChat({
    conversationId,
    otherUserId,
    currentUserId,
    bookingId,
    appointmentId,
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages
      .filter((msg) => msg.sender_id !== currentUserId && !msg.is_read)
      .map((msg) => msg.id)

    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages)
    }
  }, [messages, currentUserId, markAsRead])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    await sendMessage(inputValue.trim())
    setInputValue("")

    // Stop typing indicator
    sendTypingIndicator(false)
    setIsTypingIndicator(false)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)

    // Send typing indicator
    if (!isTypingIndicator && value.trim()) {
      sendTypingIndicator(true)
      setIsTypingIndicator(true)
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false)
      setIsTypingIndicator(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  if (loading) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chat...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-sm text-destructive mb-2">Failed to load chat</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title || `Chat with ${otherUserName}`}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender_id === currentUserId}
                  formatTime={formatMessageTime}
                  getInitials={getInitials}
                />
              ))
            )}

            {/* Typing Indicators */}
            {Object.entries(isTyping).map(([typingUserId, typing]) =>
              typing && typingUserId !== currentUserId ? (
                <div key={typingUserId} className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{otherUserName} is typing...</span>
                </div>
              ) : null,
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!inputValue.trim()} size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MessageBubbleProps {
  message: ChatMessage
  isOwn: boolean
  formatTime: (timestamp: string) => string
  getInitials: (name: string) => string
}

function MessageBubble({ message, isOwn, formatTime, getInitials }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[70%] ${isOwn ? "flex-row-reverse" : "flex-row"} items-start space-x-2`}>
        {!isOwn && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender_avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">{getInitials(message.sender_name)}</AvatarFallback>
          </Avatar>
        )}

        <div className={`${isOwn ? "mr-2" : "ml-2"}`}>
          {!isOwn && <p className="text-xs text-muted-foreground mb-1">{message.sender_name}</p>}

          <div className={`rounded-lg px-3 py-2 ${isOwn ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
            {message.message_type === "image" && message.media_url ? (
              <div className="space-y-2">
                <img
                  src={message.media_url || "/placeholder.svg"}
                  alt="Shared image"
                  className="max-w-full h-auto rounded"
                />
                {message.content && <p className="text-sm">{message.content}</p>}
              </div>
            ) : message.message_type === "file" && message.media_url ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 bg-background/10 rounded">
                  <Paperclip className="h-4 w-4" />
                  <a href={message.media_url} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                    {message.content || "Download file"}
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}
          </div>

          <div className={`flex items-center mt-1 space-x-1 ${isOwn ? "justify-end" : "justify-start"}`}>
            <span className="text-xs text-muted-foreground">{formatTime(message.created_at)}</span>
            {isOwn && message.is_read && (
              <Badge variant="secondary" className="text-xs px-1 py-0">
                Read
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
