"use client"

import { PawPrint, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import UserMenu from "@/components/auth/user-menu"
import MegaMenu from "@/components/navigation/mega-menu"

export default function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 lg:px-6">
        {/* Logo section */}
        <div className="flex items-center gap-2 font-semibold">
          <PawPrint className="h-6 w-6" />
          {"FluffyPet"}
        </div>

        <div className="flex-1 flex justify-center">
          <MegaMenu />
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
