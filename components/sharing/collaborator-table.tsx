"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type Row = { id: string; user_id: string; role: string; created_at: string; email?: string | null }

export default function CollaboratorTable({ petId }: { petId: string }) {
  const supabase = getSupabaseBrowserClient()
  const [rows, setRows] = useState<Row[]>([])
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancel = false
    async function load() {
      const { data } = await supabase
        .from("pet_collaborators")
        .select("id,user_id,role,created_at, profiles:user_id(email)")
        .eq("pet_id", petId)
      const mapped =
        (data || []).map((r: any) => ({
          id: r.id,
          user_id: r.user_id,
          role: r.role,
          created_at: r.created_at,
          email: r.profiles?.email,
        })) || []
      if (!cancel) setRows(mapped)
    }
    load()
    return () => {
      cancel = true
    }
  }, [petId, supabase])

  async function addCollaborator() {
    setLoading(true)
    try {
      // Resolve email -> user id
      const { data: userRow } = await supabase.from("profiles").select("id").eq("email", email).maybeSingle()
      if (!userRow) throw new Error("User not found")
      await supabase.from("pet_collaborators").insert({ pet_id: petId, user_id: userRow.id, role })
      setEmail("")
      setRole("viewer")
      // refresh
      const { data } = await supabase
        .from("pet_collaborators")
        .select("id,user_id,role,created_at, profiles:user_id(email)")
        .eq("pet_id", petId)
      const mapped =
        (data || []).map((r: any) => ({
          id: r.id,
          user_id: r.user_id,
          role: r.role,
          created_at: r.created_at,
          email: r.profiles?.email,
        })) || []
      setRows(mapped)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    const { error } = await supabase.from("pet_collaborators").delete().eq("id", id)
    if (error) {
      alert(error.message)
      return
    }
    setRows(rows.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border p-3">
        <div className="text-sm font-semibold mb-2">Add collaborator</div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="min-w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="vet">Vet</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addCollaborator} disabled={!email || loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
      <div className="rounded-lg border">
        <div className="p-3 text-sm font-semibold">Collaborators</div>
        <div className="divide-y text-sm">
          {rows.length === 0 ? (
            <div className="p-3 text-muted-foreground">No collaborators yet.</div>
          ) : (
            rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.email || r.user_id}</div>
                  <div className="text-xs text-muted-foreground">Role: {r.role}</div>
                </div>
                <Button variant="outline" className="bg-transparent" onClick={() => remove(r.id)}>
                  Remove
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
