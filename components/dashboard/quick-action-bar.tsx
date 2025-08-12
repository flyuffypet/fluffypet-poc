"use client"

import type React from "react"

import { Plus, Upload, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickActionBarProps {
  actions?: {
    label: string
    icon: React.ReactNode
    onClick: () => void
    variant?: "default" | "outline"
  }[]
}

const defaultActions = [
  {
    label: "Add Pet",
    icon: <Plus className="h-4 w-4" />,
    onClick: () => console.log("Add pet"),
  },
  {
    label: "Upload Media",
    icon: <Upload className="h-4 w-4" />,
    onClick: () => console.log("Upload media"),
    variant: "outline" as const,
  },
  {
    label: "Book Appointment",
    icon: <Calendar className="h-4 w-4" />,
    onClick: () => console.log("Book appointment"),
    variant: "outline" as const,
  },
  {
    label: "Add Record",
    icon: <FileText className="h-4 w-4" />,
    onClick: () => console.log("Add record"),
    variant: "outline" as const,
  },
]

export function QuickActionBar({ actions = defaultActions }: QuickActionBarProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || "default"}
          size="sm"
          onClick={action.onClick}
          className="flex items-center gap-2"
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  )
}
