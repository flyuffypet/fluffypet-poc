"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Building2, Loader2 } from "lucide-react"
import { track } from "@vercel/analytics"

type OrgRow = { id: string; name: string; org_type: string; region: string | null; role?: string }

function formatRole(role?: string) {
  if (!role) return ""
  return role.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())
}

function roleBadge(role?: string): { variant: "default" | "secondary" | "destructive" | "outline" } {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return { variant: "default" }
    case "vet":
      return { variant: "secondary" }
    case "provider":
      return { variant: "secondary" }
    case "staff":
    case "volunteer":
      return { variant: "outline" }
    default:
      return { variant: "outline" }
  }
}

export default function OrgSwitcher() {
  const supabase = getSupabaseBrowserClient()
  const [orgs, setOrgs] = useState<OrgRow[]>([])
  const [currentOrg, setCurrentOrg] = useState<OrgRow | null>(null)
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancel = false
    async function load() {
      const { data: userRes } = await supabase.auth.getUser()
      const user = userRes.user
      if (!user) return
      const [{ data: profile }, { data: memberships }] = await Promise.all([
        supabase.from("profiles").select("default_org_id").eq("id", user.id).maybeSingle(),
        supabase
          .from("organization_users")
          .select("org_id, role, status, organizations:org_id(id,name,org_type,region)")
          .eq("user_id", user.id)
          .eq("status", "active"),
      ])
      if (cancel) return
      const list: OrgRow[] =
        memberships
          ?.map((m: any) => {
            const org = m.organizations
            if (!org) return null
            return {
              id: org.id,
              name: org.name,
              org_type: org.org_type,
              region: org.region,
              role: m.role, // user's role in this org
            } as OrgRow
          })
          .filter(Boolean) ?? []
      setOrgs(list)
      const cur = list.find((o) => o.id === profile?.default_org_id) ?? list[0] ?? null
      setCurrentOrg(cur || null)
    }
    load()
    return () => {
      cancel = true
    }
  }, [supabase])

  function onSwitch(orgId: string) {
    startTransition(async () => {
      const res = await fetch("/api/org/switch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orgId }),
      })
      if (res.ok) {
        const org = orgs.find((o) => o.id === orgId) || null
        setCurrentOrg(org)
        // Optional: refresh data dependent on active org
        // location.reload()
      } else {
        const { error } = await res.json()
        alert(error || "Failed to switch organization")
      }
    })
  }

  return (
    <DropdownMenu
      onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          track("org_menu_open", {
            org_count: orgs.length,
            has_active_org: Boolean(currentOrg?.id),
            role: currentOrg?.role || null,
          })
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Building2 className="h-4 w-4" />}
          <span className="truncate max-w-[12ch] sm:max-w-[18ch]">{currentOrg?.name || "Select org"}</span>
          {currentOrg?.role ? (
            <Badge variant={roleBadge(currentOrg.role).variant} className="hidden sm:inline text-[10px]">
              {formatRole(currentOrg.role)}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Organizations</DropdownMenuLabel>
        {orgs.length === 0 ? (
          <DropdownMenuItem disabled>No organizations</DropdownMenuItem>
        ) : (
          orgs.map((o) => (
            <DropdownMenuItem key={o.id} onClick={() => onSwitch(o.id)} className="cursor-pointer">
              <div className="flex w-full items-center justify-between">
                <span className="truncate">{o.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">({o.org_type})</span>
                  {o.role ? (
                    <Badge variant={roleBadge(o.role).variant} className="text-[10px]">
                      {formatRole(o.role)}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
