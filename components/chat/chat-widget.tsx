"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle, X, Minimize2 } from "lucide-react"
import RealtimeChat from "./realtime-chat"

interface ChatWidgetProps {
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

export default function ChatWidget({
  conversationId,
  otherUserId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  otherUserName,
  bookingId,
  appointmentId,
  title,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)} className="rounded-full h-12 w-12 shadow-lg" size="icon">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="shadow-xl">
        <div className="flex items-center justify-between p-3 border-b">
          <div>
            <h3 className="font-semibold text-sm">{title || `Chat with ${otherUserName}`}</h3>
            <p className="text-xs text-muted-foreground">
              {bookingId
                ? `Booking #${bookingId.slice(-8)}`
                : appointmentId
                  ? `Appointment #${appointmentId.slice(-8)}`
                  : "Direct Message"}
            </p>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <CardContent className="p-0">
            <RealtimeChat
              conversationId={conversationId}
              otherUserId={otherUserId}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserAvatar={currentUserAvatar}
              otherUserName={otherUserName}
              bookingId={bookingId}
              appointmentId={appointmentId}
              title={title}
            />
          </CardContent>
        )}
      </Card>
    </div>
  )
}
