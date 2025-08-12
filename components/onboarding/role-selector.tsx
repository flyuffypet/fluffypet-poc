"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, PawPrint, Briefcase } from "lucide-react"

export default function OnboardingRoleSelector() {
  const router = useRouter()
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5" /> I’m a Pet Owner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Create and manage pet profiles, book services, and chat with providers.
          </p>
          <Button onClick={() => router.push("/")}>Continue</Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> I’m a Service Provider
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Join or create an organization, receive bookings, and chat with clients.
          </p>
          <Button variant="secondary" onClick={() => router.push("/org/new")}>
            Create org
          </Button>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> I’m an Organization Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Set up your Clinic/NGO/Breeder/Hostel, invite members, and manage roles.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/org/new")}>Create org</Button>
            <Button variant="outline" onClick={() => router.push("/org/join")}>
              Accept invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
