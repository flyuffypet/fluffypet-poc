"use client"

import { usePathname } from "next/navigation"
import { Plus, Check, Upload, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"

interface FABConfig {
  icon: any
  label: string
  onClick: () => void
  variant?: "default" | "secondary"
}

const pageFABs: Record<string, FABConfig> = {
  // Pet Owner
  "/dashboard": {
    icon: Plus,
    label: "Add Record",
    onClick: () => console.log("Add record"),
  },
  "/dashboard/insights": {
    icon: Check,
    label: "Acknowledge Selected",
    onClick: () => console.log("Acknowledge"),
  },
  "/dashboard/appointments": {
    icon: Calendar,
    label: "Book Appointment",
    onClick: () => console.log("Book appointment"),
  },
  "/dashboard/media": {
    icon: Upload,
    label: "Upload",
    onClick: () => console.log("Upload media"),
  },

  // Service Provider
  "/provider/dashboard": {
    icon: Check,
    label: "Accept Next",
    onClick: () => console.log("Accept request"),
  },
  "/provider/dashboard/calendar": {
    icon: Plus,
    label: "Add Slot",
    onClick: () => console.log("Add slot"),
  },

  // Veterinarian
  "/vet/dashboard/visits": {
    icon: FileText,
    label: "Add SOAP Note",
    onClick: () => console.log("Add SOAP note"),
  },

  // Clinic Admin
  "/clinic/dashboard/bookings": {
    icon: Plus,
    label: "New Booking",
    onClick: () => console.log("New booking"),
  },

  // Front Desk
  "/frontdesk/dashboard/bookings": {
    icon: Plus,
    label: "Create Booking",
    onClick: () => console.log("Create booking"),
  },

  // NGO Admin
  "/ngo/dashboard": {
    icon: Plus,
    label: "Create Case",
    onClick: () => console.log("Create case"),
  },

  // NGO Volunteer
  "/volunteer/dashboard/updates": {
    icon: Plus,
    label: "Add Update",
    onClick: () => console.log("Add update"),
  },
}

export function ContextFAB() {
  const pathname = usePathname()
  const { user } = useDashboardData()

  const fabConfig = pageFABs[pathname]

  if (!fabConfig || !user) return null

  const Icon = fabConfig.icon

  return (
    <Button
      size="lg"
      className={cn("fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg", "md:bottom-4 md:right-4")}
      onClick={fabConfig.onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{fabConfig.label}</span>
    </Button>
  )
}
