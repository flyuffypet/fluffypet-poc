"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Activity,
  Pill,
  Calendar,
  MoreHorizontal,
  CalendarClock,
  Users,
  Wallet,
  Stethoscope,
  PawPrint,
  FlaskRound,
  Layout,
  Inbox,
  UserCog,
  LogIn,
  CalendarPlus,
  CreditCard,
  Building,
  Kanban,
  MapPin,
  HeartHandshake,
  CheckCircle,
  Navigation,
  Baby,
  ListChecks,
  Contact,
  ShieldCheck,
  Grid3X3,
  ClipboardCheck,
  FileIcon as FileInvoice,
  BadgeCheck,
  ShieldAlert,
  LineChartIcon as ChartLine,
  LifeBuoy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { Badge } from "@/components/ui/badge"

interface NavItem {
  href: string
  label: string
  icon: any
  badge?: number
}

const roleNavItems: Record<string, NavItem[]> = {
  pet_owner: [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/dashboard/insights", label: "Insights", icon: Activity },
    { href: "/dashboard/dues", label: "Dues", icon: Pill },
    { href: "/dashboard/appointments", label: "Appointments", icon: Calendar },
    { href: "/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  service_provider: [
    { href: "/provider/dashboard", label: "Today", icon: CalendarClock },
    { href: "/provider/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/provider/dashboard/clients", label: "Clients", icon: Users },
    { href: "/provider/dashboard/payouts", label: "Payouts", icon: Wallet },
    { href: "/provider/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  veterinarian: [
    { href: "/vet/dashboard", label: "Triage", icon: Activity },
    { href: "/vet/dashboard/visits", label: "Visits", icon: Stethoscope },
    { href: "/vet/dashboard/patients", label: "Patients", icon: PawPrint },
    { href: "/vet/dashboard/orders", label: "Orders/Labs", icon: FlaskRound },
    { href: "/vet/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  admin: [
    { href: "/clinic/dashboard", label: "Overview", icon: Layout },
    { href: "/clinic/dashboard/calendar", label: "Calendar", icon: Calendar },
    { href: "/clinic/dashboard/bookings", label: "Bookings", icon: Inbox },
    { href: "/clinic/dashboard/staff", label: "Staff", icon: UserCog },
    { href: "/clinic/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  frontdesk: [
    { href: "/frontdesk/dashboard", label: "Check-in", icon: LogIn },
    { href: "/frontdesk/dashboard/bookings", label: "Bookings", icon: CalendarPlus },
    { href: "/frontdesk/dashboard/payments", label: "Payments", icon: CreditCard },
    { href: "/frontdesk/dashboard/rooms", label: "Rooms", icon: Building },
    { href: "/frontdesk/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  ngo_admin: [
    { href: "/ngo/dashboard", label: "Rescue Board", icon: Kanban },
    { href: "/ngo/dashboard/map", label: "Map", icon: MapPin },
    { href: "/ngo/dashboard/adoptions", label: "Adoptions", icon: HeartHandshake },
    { href: "/ngo/dashboard/volunteers", label: "Volunteers", icon: Users },
    { href: "/ngo/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  volunteer: [
    { href: "/volunteer/dashboard", label: "My Tasks", icon: CheckCircle },
    { href: "/volunteer/dashboard/nearby", label: "Nearby", icon: Navigation },
    { href: "/volunteer/dashboard/shifts", label: "Shifts", icon: Calendar },
    { href: "/volunteer/dashboard/updates", label: "Updates", icon: MoreHorizontal },
    { href: "/volunteer/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  breeder: [
    { href: "/breeder/dashboard", label: "Litters", icon: Baby },
    { href: "/breeder/dashboard/waitlist", label: "Waitlist", icon: ListChecks },
    { href: "/breeder/dashboard/buyers", label: "Buyers", icon: Contact },
    { href: "/breeder/dashboard/compliance", label: "Compliance", icon: ShieldCheck },
    { href: "/breeder/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  hostel_admin: [
    { href: "/hostel/dashboard", label: "Occupancy", icon: Grid3X3 },
    { href: "/hostel/dashboard/bookings", label: "Bookings", icon: Calendar },
    { href: "/hostel/dashboard/care", label: "Care", icon: ClipboardCheck },
    { href: "/hostel/dashboard/invoices", label: "Invoices", icon: FileInvoice },
    { href: "/hostel/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
  superadmin: [
    { href: "/admin/dashboard", label: "Verify", icon: BadgeCheck },
    { href: "/admin/dashboard/moderate", label: "Moderate", icon: ShieldAlert },
    { href: "/admin/dashboard/metrics", label: "Metrics", icon: ChartLine },
    { href: "/admin/dashboard/support", label: "Support", icon: LifeBuoy },
    { href: "/admin/dashboard/more", label: "More", icon: MoreHorizontal },
  ],
}

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user, loading } = useDashboardData()

  if (loading || !user) return null

  const navItems = roleNavItems[user.role] || roleNavItems.pet_owner

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-pb">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="absolute -right-2 -top-2 h-4 w-4 p-0 text-xs">
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
