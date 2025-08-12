"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createOrganization } from "@/lib/actions/org-actions"
import { toast } from "sonner"

export default function CreateOrgForm() {
  const [name, setName] = useState("")
  const [region, setRegion] = useState("")
  const [orgType, setOrgType] = useState("clinic")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await createOrganization(formData)
      toast.success("Organization created successfully!")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Input
          name="name"
          placeholder="Organization name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          name="region"
          placeholder="Region (e.g., Mumbai, IN)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <input type="hidden" name="org_type" value={orgType} />
        <Select value={orgType} onValueChange={setOrgType}>
          <SelectTrigger>
            <SelectValue placeholder="Organization Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="ngo">NGO</SelectItem>
            <SelectItem value="breeder">Breeder</SelectItem>
            <SelectItem value="hostel">Hostel</SelectItem>
            <SelectItem value="solo_provider">Solo Provider</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? "Creating..." : "Create organization"}
      </Button>
    </form>
  )
}
