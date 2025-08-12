"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Users,
  Search,
  Eye,
  Ban,
  CheckCircle,
  UserPlus,
  Mail,
  Phone,
  Activity,
  AlertTriangle,
  Shield,
  Download,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  platform_role?: string
  status: string
  created_at: string
  last_sign_in_at?: string
  phone?: string
  avatar_url?: string
  organizations?: any[]
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          first_name,
          last_name,
          role,
          platform_role,
          status,
          created_at,
          last_sign_in_at,
          phone,
          avatar_url,
          organizations:organization_members(
            organization:organizations(
              id,
              name,
              org_type
            )
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error loading users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleUserAction = async (userId: string, action: "suspend" | "activate" | "delete") => {
    try {
      setActionLoading(userId)

      let updateData: any = {}

      switch (action) {
        case "suspend":
          updateData = { status: "suspended" }
          break
        case "activate":
          updateData = { status: "active" }
          break
        case "delete":
          // In a real app, you might want to soft delete or archive
          const { error: deleteError } = await supabase.from("profiles").delete().eq("id", userId)

          if (deleteError) throw deleteError
          await loadUsers()
          return
      }

      const { error } = await supabase.from("profiles").update(updateData).eq("id", userId)

      if (error) throw error
      await loadUsers()
    } catch (error) {
      console.error(`Error ${action}ing user:`, error)
      alert(`Failed to ${action} user`)
    } finally {
      setActionLoading(null)
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ["Email", "Name", "Role", "Status", "Created", "Last Active", "Organizations"].join(","),
      ...filteredUsers.map((user) =>
        [
          user.email,
          `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          user.role,
          user.status,
          new Date(user.created_at).toLocaleDateString(),
          user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never",
          user.organizations?.length || 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "suspended":
        return "destructive"
      case "pending":
        return "secondary"
      case "inactive":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return "destructive"
      case "veterinarian":
        return "default"
      case "service_provider":
        return "secondary"
      case "pet_owner":
        return "outline"
      default:
        return "secondary"
    }
  }

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    newThisMonth: users.filter((u) => {
      const created = new Date(u.created_at)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{userStats.suspended}</div>
            <p className="text-xs text-muted-foreground">Suspended accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recent signups</p>
          </CardContent>
        </Card>
      </div>

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportUsers}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="pet_owner">Pet Owner</SelectItem>
                <SelectItem value="veterinarian">Veterinarian</SelectItem>
                <SelectItem value="service_provider">Service Provider</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>No users found matching your criteria</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {user.avatar_url ? (
                        <img src={user.avatar_url || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <Users className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {user.first_name || user.last_name
                          ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                          : user.email}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      )}
                      <div className="flex gap-2 mt-1">
                        <Badge variant={getRoleColor(user.role)} className="text-xs">
                          {user.role.replace("_", " ")}
                        </Badge>
                        <Badge variant={getStatusColor(user.status)} className="text-xs">
                          {user.status}
                        </Badge>
                        {user.platform_role && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            {user.platform_role}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                        {user.last_sign_in_at && (
                          <> • Last active: {new Date(user.last_sign_in_at).toLocaleDateString()}</>
                        )}
                        {user.organizations && user.organizations.length > 0 && (
                          <> • {user.organizations.length} org(s)</>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={showUserDetails && selectedUser?.id === user.id}
                      onOpenChange={(open) => {
                        setShowUserDetails(open)
                        if (!open) setSelectedUser(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                        </DialogHeader>
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <p className="text-sm">
                                  {selectedUser.first_name || selectedUser.last_name
                                    ? `${selectedUser.first_name || ""} ${selectedUser.last_name || ""}`.trim()
                                    : "Not provided"}
                                </p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="text-sm">{selectedUser.email}</p>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <p className="text-sm">{selectedUser.phone || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Role</Label>
                                <p className="text-sm">{selectedUser.role.replace("_", " ")}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge variant={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                              </div>
                              <div>
                                <Label>Created</Label>
                                <p className="text-sm">{new Date(selectedUser.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                            {selectedUser.organizations && selectedUser.organizations.length > 0 && (
                              <div>
                                <Label>Organizations</Label>
                                <div className="space-y-2 mt-2">
                                  {selectedUser.organizations.map((orgMember: any, index: number) => (
                                    <div key={index} className="p-2 border rounded">
                                      <p className="font-medium">{orgMember.organization?.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {orgMember.organization?.org_type?.replace("_", " ")}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {user.status === "active" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === user.id}
                        onClick={() => handleUserAction(user.id, "suspend")}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        {actionLoading === user.id ? "..." : "Suspend"}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={actionLoading === user.id}
                        onClick={() => handleUserAction(user.id, "activate")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {actionLoading === user.id ? "..." : "Activate"}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={actionLoading === user.id}
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
                          handleUserAction(user.id, "delete")
                        }
                      }}
                    >
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
