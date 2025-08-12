"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function CreateAppointmentModal({ petId, onCreated }: { petId: string; onCreated?: () => void }) {
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const scheduled_at = new Date(`${date}T${time || "09:00"}:00Z`).toISOString()
      const { data: auth } = await supabase.auth.getUser()
      const user = auth.user
      const { error } = await supabase.from("appointments").insert({
        pet_id: petId,
        owner_id: user?.id || null,
        scheduled_at,
        status: "scheduled",
      })
      if (error) throw error
      toast({ title: "Appointment created" })
      setOpen(false)
      onCreated?.()
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent">
          Book Visit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Time</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={!date || saving}>
            {saving ? "Saving..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
