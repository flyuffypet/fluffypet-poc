"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"

export default function InviteMemberModal({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("staff")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function onInvite() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/invites/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orgId, email, role, note }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invite failed")
      setResult(`Invite sent. Token: ${data.token}`)
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-1">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@org.com" />
          </div>
          <div className="grid gap-1">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="vet">Vet</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label>Note (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Welcome note" />
          </div>
          {result && <p className="text-xs text-muted-foreground">{result}</p>}
        </div>
        <DialogFooter>
          <Button onClick={onInvite} disabled={loading || !email}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
