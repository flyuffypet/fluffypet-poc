"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AddRecordQuickModal({ petId, onAdded }: { petId: string; onAdded?: () => void }) {
  const supabase = getSupabaseBrowserClient()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState("note")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const user = auth.user
      const { error } = await supabase.from("medical_records").insert({
        pet_id: petId,
        record_type: type,
        data: { note },
        created_by: user?.id || null,
      })
      if (error) throw error
      toast({ title: "Record added" })
      setOpen(false)
      setNote("")
      onAdded?.()
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
          Add Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add quick record</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="note">Note</SelectItem>
                <SelectItem value="visit">Visit</SelectItem>
                <SelectItem value="vitals">Vitals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Details</Label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
