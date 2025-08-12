"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserPlus, Settings, Mail, Phone } from "lucide-react"

export function ClinicStaffRoles() {
  const [searchQuery, setSearchQuery] = useState("")

  const mockStaff = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      email: "sarah.smith@clinic.com",
      phone: "(555) 123-4567",
      role: "veterinarian",
      status: "active",
      joinDate: "2023-01-15",
      permissions: ["patient_care", "surgery", "prescriptions"],
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike.johnson@clinic.com",
      phone: "(555) 987-6543",
      role: "technician",
      status: "active",
      joinDate: "2023-03-20",
      permissions: ["patient_care", "lab_work"],
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.davis@clinic.com",
      phone: "(555) 456-7890",
      role: "front_desk",
      status: "active",
      joinDate: "2023-06-10",
      permissions: ["scheduling", "payments"],
    },
  ]

  const getRoleColor = (role: string) => {
    switch (role) {
      case "veterinarian":
        return "default"
      case "technician":
        return "secondary"
      case "front_desk":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Staff & Roles
        </h2>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStaff.length}</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veterinarians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStaff.filter((s) => s.role === "veterinarian").length}</div>
            <p className="text-xs text-muted-foreground">Licensed vets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStaff.filter((s) => s.role === "technician").length}</div>
            <p className="text-xs text-muted-foreground">Support staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Front Desk</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStaff.filter((s) => s.role === "front_desk").length}</div>
            <p className="text-xs text-muted-foreground">Reception staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staff Members</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="veterinarian">Veterinarian</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="front_desk">Front Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStaff.map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{staff.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {staff.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {staff.phone}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Joined: {new Date(staff.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={getRoleColor(staff.role)}>{staff.role.replace("_", " ")}</Badge>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {staff.permissions.slice(0, 2).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace("_", " ")}
                        </Badge>
                      ))}
                      {staff.permissions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{staff.permissions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
