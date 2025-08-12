"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, PawPrint, Briefcase, Stethoscope, Heart } from "lucide-react"
import { updateUserRole } from "@/lib/actions/auth-actions"

export default function EnhancedRoleSelector() {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedOrgType, setSelectedOrgType] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleRoleSelection = async (role: string, orgType?: string) => {
    setLoading(true)

    const formData = new FormData()
    formData.append("role", role)
    if (orgType) {
      formData.append("orgType", orgType)
    }

    try {
      await updateUserRole(formData)
    } catch (error) {
      console.error("Role selection error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Pet Owner */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRoleSelection("pet_owner")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-blue-600" />
              Pet Owner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your pets' health records, book appointments, and connect with service providers.
            </p>
            <Button className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Continue as Pet Owner"}
            </Button>
          </CardContent>
        </Card>

        {/* Service Provider */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRoleSelection("service_provider")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-green-600" />
              Service Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Offer grooming, training, walking, or boarding services to pet owners.
            </p>
            <Button className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Continue as Provider"}
            </Button>
          </CardContent>
        </Card>

        {/* Veterinarian */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRoleSelection("veterinarian")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-red-600" />
              Veterinarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Provide medical care, manage patient records, and collaborate with pet owners.
            </p>
            <Button className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Continue as Veterinarian"}
            </Button>
          </CardContent>
        </Card>

        {/* Volunteer */}
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleRoleSelection("volunteer")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              Volunteer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Help with rescue operations, fostering, and community outreach programs.
            </p>
            <Button className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Continue as Volunteer"}
            </Button>
          </CardContent>
        </Card>

        {/* Organization Admin */}
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600" />
              Organization Administrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage a clinic, NGO, breeding facility, or boarding facility. Set up your organization and invite team
              members.
            </p>

            <div className="space-y-3">
              <Select value={selectedOrgType} onValueChange={setSelectedOrgType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vet_clinic">Veterinary Clinic</SelectItem>
                  <SelectItem value="grooming_salon">Grooming Salon</SelectItem>
                  <SelectItem value="training_center">Training Center</SelectItem>
                  <SelectItem value="hostel">Pet Boarding Facility</SelectItem>
                  <SelectItem value="ngo">NGO/Rescue Organization</SelectItem>
                  <SelectItem value="breeding_facility">Breeding Facility</SelectItem>
                </SelectContent>
              </Select>

              <Button
                className="w-full"
                disabled={!selectedOrgType || loading}
                onClick={() => selectedOrgType && handleRoleSelection("admin", selectedOrgType)}
              >
                {loading ? "Setting up..." : "Create Organization"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
