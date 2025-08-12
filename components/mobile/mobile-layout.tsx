"use client"

import type React from "react"

import { MobileHeader } from "./mobile-header"
import { MobileBottomNav } from "./mobile-bottom-nav"
import { ContextFAB } from "./context-fab"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <main className="pb-20 pt-2">{children}</main>
      <MobileBottomNav />
      <ContextFAB />
    </div>
  )
}
