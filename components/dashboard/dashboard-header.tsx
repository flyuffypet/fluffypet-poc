"use client"

import type React from "react"

import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrgSwitcher } from "./org-switcher"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showFilters?: boolean
  actions?: React.ReactNode
}

export function DashboardHeader({
  title,
  subtitle,
  showSearch = true,
  showFilters = true,
  actions,
}: DashboardHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <OrgSwitcher />

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="w-[200px] pl-8" />
            </div>
          )}

          {showFilters && (
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}

          {actions}
        </div>
      </div>
    </div>
  )
}
