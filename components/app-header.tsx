"use client"

import { PawPrint, Bell, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import UserMenu from "@/components/auth/user-menu"
import MegaMenu from "@/components/navigation/mega-menu"
import Link from "next/link"

export default function AppHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 w-full max-w-none items-center justify-between px-4 lg:px-6">
        {/* Logo section */}
        <Link href="/" className="flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">FluffyPet</span>
        </Link>

        <div className="flex-1 flex justify-center">
          <MegaMenu />
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Link href="/sos" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">SOS</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
