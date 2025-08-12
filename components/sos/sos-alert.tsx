"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Clock, Phone, MessageCircle } from "lucide-react"

interface SOSAlertProps {
  alert: {
    id: string
    type: "rescue" | "medical" | "other"
    description: string
    location: string
    timeAgo: string
    status: "new" | "responding" | "resolved"
    responderCount: number
    photo?: string
  }
  isResponder?: boolean
}

export function SOSAlert({ alert, isResponder = false }: SOSAlertProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "rescue":
        return "🚨"
      case "medical":
        return "🏥"
      default:
        return "❓"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "destructive"
      case "responding":
        return "default"
      case "resolved":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card className={`${alert.status === "new" ? "border-red-200 bg-red-50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(alert.type)}</span>
            <div>
              <CardTitle className="text-base">
                {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Emergency
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusColor(alert.status)}>{alert.status}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.timeAgo}
                </span>
              </div>
            </div>
          </div>
          {alert.status === "new" && <AlertTriangle className="h-5 w-5 text-red-600" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
          <span className="text-sm">{alert.location}</span>
        </div>

        {alert.description && <p className="text-sm text-muted-foreground">{alert.description}</p>}

        {alert.photo && (
          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Photo attached</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            {alert.responderCount} responder{alert.responderCount !== 1 ? "s" : ""} notified
          </span>

          {isResponder && alert.status === "new" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <MessageCircle className="h-4 w-4 mr-1" />
                Contact
              </Button>
              <Button size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Respond
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
