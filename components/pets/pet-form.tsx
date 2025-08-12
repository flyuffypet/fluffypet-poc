"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import SaveBar from "@/components/ui/save-bar"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import AvatarUploader from "./avatar-uploader"

export default function PetForm() {
  const supabase = getSupabaseBrowserClient()
  const [name, setName] = useState("")
  const [species, setSpecies] = useState("Dog")
  const [breed, setBreed] = useState("")
  const [sex, setSex] = useState("unknown")
  const [dob, setDob] = useState("")
  const [color, setColor] = useState("")
  const [microchip, setMicrochip] = useState("")
  const [notes, setNotes] = useState("")
  const [petId, setPetId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  async function save() {
    setSaving(true)
    setStatus(null)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const user = auth.user
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("pets")
        .insert({
          owner_id: user.id,
          name,
          species,
          breed,
          sex,
          dob: dob || null,
          color,
          microchip,
          status: "active",
          notes,
        })
        .select("id")
        .single()
      if (error) throw error
      setPetId(data.id)
      setStatus("Saved. You can upload an avatar image now.")
    } catch (e: any) {
      setStatus(`Error: ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Milo" />
        </div>
        <div className="space-y-2">
          <Label>Species</Label>
          <Select value={species} onValueChange={setSpecies}>
            <SelectTrigger>
              <SelectValue placeholder="Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dog">Dog</SelectItem>
              <SelectItem value="Cat">Cat</SelectItem>
              <SelectItem value="Bird">Bird</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Breed</Label>
          <Input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Labrador Retriever" />
        </div>
        <div className="space-y-2">
          <Label>Sex</Label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger>
              <SelectValue placeholder="Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Color</Label>
          <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="Yellow" />
        </div>
        <div className="space-y-2">
          <Label>Microchip</Label>
          <Input value={microchip} onChange={(e) => setMicrochip(e.target.value)} placeholder="985..." />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </div>
      </div>

      {petId && (
        <div className="rounded-lg border p-3">
          <div className="mb-2 text-sm font-semibold">Avatar upload (optional)</div>
          <AvatarUploader petId={petId} />
          <div className="mt-2 text-xs text-muted-foreground">
            After uploading, you can set it as the cover in the pet profile.
          </div>
        </div>
      )}

      {status && <div className="text-sm text-muted-foreground">{status}</div>}

      <SaveBar onSave={save} saving={saving} canSave={name.trim().length > 0} />
    </div>
  )
}
