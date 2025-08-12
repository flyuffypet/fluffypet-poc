"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, Bell, MoreVertical, Plus, Upload, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { OrgSwitcher } from "@/components/dashboard/org-switcher"

interface HeaderAction {
  icon: any
  label: string
  onClick: () => void
}

const pageHeaders: Record<
  string,
  {
    title: string
    actions?: HeaderAction[]
    showBack?: boolean
  }
> = {
  // Pet Owner
  "/dashboard": {
    title: "My Pets",
    actions: [
      { icon: Plus, label: "Add Record", onClick: () => {} },
      { icon: Upload, label: "Upload", onClick: () => {} },
    ],
  },
  "/dashboard/insights": {
    title: "Insights",
    actions: [
      { icon: Filter, label: "Filter", onClick: () => {} },
      { icon: Plus, label: "Acknowledge All", onClick: () => {} },
    ],
  },
  "/dashboard/appointments": {
    title: "Appointments",
    actions: [
      { icon: Plus, label: "Book", onClick: () => {} },
      { icon: Filter, label: "Filter", onClick: () => {} },
    ],
  },
  "/dashboard/dues": {
    title: "Dues",
    actions: [
      { icon: Plus, label: "Snooze All", onClick: () => {} },
      { icon: Filter, label: "Filter", onClick: () => {} },
    ],
  },

  // Service Provider
  "/provider/dashboard": {
    title: "Today",
    actions: [
      { icon: Plus, label: "Go Online", onClick: () => {} },
      { icon: Plus, label: "New Slot", onClick: () => {} },
    ],
  },
  "/provider/dashboard/calendar": {
    title: "Calendar",
    actions: [
      { icon: Plus, label: "Add Time Off", onClick: () => {} },
      { icon: Filter, label: "Filter", onClick: () => {} },
    ],
  },

  // Veterinarian
  "/vet/dashboard": {
    title: "Triage",
    actions: [
      { icon: Plus, label: "Start Tele-consult", onClick: () => {} },
      { icon: Bell, label: "Broadcast Nurse Call", onClick: () => {} },
    ],
  },
  "/vet/dashboard/visits": {
    title: "Visits",
    actions: [
      { icon: Plus, label: "New Note", onClick: () => {} },
      { icon: Plus, label: "Order Labs", onClick: () => {} },
    ],
  },

  // Clinic Admin
  "/clinic/dashboard": {
    title: "Clinic",
    actions: [
      { icon: Plus, label: "Configure Hours", onClick: () => {} },
      { icon: Plus, label: "Add Service", onClick: () => {} },
    ],
  },

  // Add more page headers as needed...
}

export function MobileHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, notifications } = useDashboardData()

  const headerConfig = pageHeaders[pathname] || { title: "Dashboard" }
  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  const handleBack = () => {
    router.back()
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {headerConfig.showBack ? (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <OrgSwitcher />
          )}
        </div>

        {/* Center Section */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-semibold truncate">{headerConfig.title}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1">
          {/* Quick Actions */}
          {headerConfig.actions?.slice(0, 2).map((action, index) => {
            const Icon = action.icon
            return (
              <Button key={index} variant="ghost" size="sm" onClick={action.onClick} className="h-8 w-8 p-0">
                <Icon className="h-4 w-4" />
                <span className="sr-only">{action.label}</span>
              </Button>
            )
          })}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 p-0 text-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Button>

          {/* More Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {headerConfig.actions?.slice(2).map((action, index) => (
                <DropdownMenuItem key={index} onClick={action.onClick}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
