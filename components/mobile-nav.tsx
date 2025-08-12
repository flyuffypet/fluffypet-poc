"use client"

import Link from "next/link"
import { Home, PawPrint, CalendarPlus, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pets", label: "Pets", icon: PawPrint },
  { href: "/book", label: "Book", icon: CalendarPlus },
  { href: "/messages", label: "Chat", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User },
]

export default function MobileNav() {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      )}
      aria-label="Primary"
    >
      <ul className="mx-auto grid h-20 max-w-3xl grid-cols-5 items-center text-xs">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href} className="flex justify-center">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
