"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useDashboardUser } from "@/lib/hooks/use-dashboard-data"
import type { Organization } from "@/lib/types/dashboard"

export function OrgSwitcher() {
  const { user } = useDashboardUser()
  const [open, setOpen] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(
    user?.organizations?.find((org) => org.id === user.active_org_id) || null,
  )

  if (!user?.organizations || user.organizations.length <= 1) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{selectedOrg?.name || "Select organization"}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup>
              {user.organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => {
                    setSelectedOrg(org)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", selectedOrg?.id === org.id ? "opacity-100" : "opacity-0")} />
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{org.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
