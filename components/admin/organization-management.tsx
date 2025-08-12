"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Building2, Search, Eye, CheckCircle, Ban, Users, Calendar, DollarSign, Download, Clock } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface Organization {
  id: string
  name: string
  org_type: string
  region?: string
  status: string
  created_at: string
  verification_status?: string
  verification_submitted_at?: string
  verification_notes?: string
  contact_email?: string
  phone?: string
  address?: string
  website?: string
  description?: string
  member_count?: number
  total_bookings?: number
  total_revenue?: number
}

export function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [showOrgDetails, setShowOrgDetails] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("organizations")
        .select(`
          id,
          name,
          org_type,
          region,
          status,
          created_at,
          verification_status,
          verification_submitted_at,
          verification_notes,
          contact_email,
          phone,
          address,
          website,
          description,
          organization_members(count)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Transform data to include member count
      const transformedData =
        data?.map((org: any) => ({
          ...org,
          member_count: org.organization_members?.[0]?.count || 0,
          total_bookings: Math.floor(Math.random() * 500), // Mock data
          total_revenue: Math.floor(Math.random() * 50000), // Mock data
        })) || []

      setOrganizations(transformedData)
    } catch (error) {
      console.error("Error loading organizations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.contact_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.region?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || org.org_type === typeFilter
    const matchesStatus = statusFilter === "all" || org.status === statusFilter
    const matchesVerification = verificationFilter === "all" || org.verification_status === verificationFilter

    return matchesSearch && matchesType && matchesStatus && matchesVerification
  })

  const handleOrgAction = async (orgId: string, action: "approve" | "reject" | "suspend" | "activate") => {
    try {
      setActionLoading(orgId)

      let updateData: any = {}

      switch (action) {
        case "approve":
          updateData = {
            verification_status: "approved",
            status: "active",
            verification_notes: "Approved by admin",
          }
          break
        case "reject":
          updateData = {
            verification_status: "rejected",
            verification_notes: "Rejected by admin - documentation insufficient",
          }
          break
        case "suspend":
          updateData = { status: "suspended" }
          break
        case "activate":
          updateData = { status: "active" }
          break
      }

      const { error } = await supabase.from("organizations").update(updateData).eq("id", orgId)

      if (error) throw error
      await loadOrganizations()
    } catch (error) {
      console.error(`Error ${action}ing organization:`, error)
      alert(`Failed to ${action} organization`)
    } finally {
      setActionLoading(null)
    }
  }

  const exportOrganizations = () => {
    const csvContent = [
      ["Name", "Type", "Region", "Status", "Verification", "Members", "Created", "Contact"].join(","),
      ...filteredOrganizations.map((org) =>
        [
          org.name,
          org.org_type,
          org.region || "",
          org.status,
          org.verification_status || "pending",
          org.member_count || 0,
          new Date(org.created_at).toLocaleDateString(),
          org.contact_email || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `organizations-export-${new Date().toISOString().split("T")[0]}.csv`
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

  const getVerificationColor = (status?: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "under_review":
        return "secondary"
      case "pending":
      default:
        return "outline"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vet_clinic":
        return "default"
      case "ngo":
        return "secondary"
      case "grooming_salon":
        return "outline"
      case "training_center":
        return "outline"
      default:
        return "secondary"
    }
  }

  const orgStats = {
    total: organizations.length,
    active: organizations.filter((o) => o.status === "active").length,
    pending: organizations.filter((o) => o.verification_status === "pending").length,
    suspended: organizations.filter((o) => o.status === "suspended").length,
    newThisMonth: organizations.filter((o) => {
      const created = new Date(o.created_at)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading organizations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgStats.total}</div>
            <p className="text-xs text-muted-foreground">Registered orgs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{orgStats.active}</div>
            <p className="text-xs text-muted-foreground">Verified & active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{orgStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <Ban className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{orgStats.suspended}</div>
            <p className="text-xs text-muted-foreground">Suspended orgs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orgStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recent signups</p>
          </CardContent>
        </Card>
      </div>

      {/* Organization Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Organization Management</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportOrganizations}>
                <Download className="h-4 w-4 mr-2" />
                Export
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
                placeholder="Search organizations by name, email, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="vet_clinic">Vet Clinic</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
                <SelectItem value="grooming_salon">Grooming Salon</SelectItem>
                <SelectItem value="training_center">Training Center</SelectItem>
                <SelectItem value="hostel">Pet Hostel</SelectItem>
                <SelectItem value="breeding_facility">Breeding Facility</SelectItem>
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
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organization List */}
          <div className="space-y-4">
            {filteredOrganizations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-8 w-8 mx-auto mb-2" />
                <p>No organizations found matching your criteria</p>
              </div>
            ) : (
              filteredOrganizations.map((org) => (
                <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{org.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{org.contact_email || "No email"}</span>
                        {org.region && <span>• {org.region}</span>}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={getTypeColor(org.org_type)} className="text-xs">
                          {org.org_type.replace("_", " ")}
                        </Badge>
                        <Badge variant={getStatusColor(org.status)} className="text-xs">
                          {org.status}
                        </Badge>
                        <Badge variant={getVerificationColor(org.verification_status)} className="text-xs">
                          {org.verification_status || "pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {org.member_count} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {org.total_bookings} bookings
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />${org.total_revenue?.toLocaleString()}
                        </span>
                        <span>Created: {new Date(org.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={showOrgDetails && selectedOrg?.id === org.id}
                      onOpenChange={(open) => {
                        setShowOrgDetails(open)
                        if (!open) setSelectedOrg(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setSelectedOrg(org)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Organization Details</DialogTitle>
                        </DialogHeader>
                        {selectedOrg && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Organization Name</Label>
                                <p className="text-sm font-medium">{selectedOrg.name}</p>
                              </div>
                              <div>
                                <Label>Type</Label>
                                <p className="text-sm">{selectedOrg.org_type.replace("_", " ")}</p>
                              </div>
                              <div>
                                <Label>Contact Email</Label>
                                <p className="text-sm">{selectedOrg.contact_email || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Phone</Label>
                                <p className="text-sm">{selectedOrg.phone || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Region</Label>
                                <p className="text-sm">{selectedOrg.region || "Not specified"}</p>
                              </div>
                              <div>
                                <Label>Website</Label>
                                <p className="text-sm">{selectedOrg.website || "Not provided"}</p>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge variant={getStatusColor(selectedOrg.status)}>{selectedOrg.status}</Badge>
                              </div>
                              <div>
                                <Label>Verification Status</Label>
                                <Badge variant={getVerificationColor(selectedOrg.verification_status)}>
                                  {selectedOrg.verification_status || "pending"}
                                </Badge>
                              </div>
                              <div>
                                <Label>Created</Label>
                                <p className="text-sm">{new Date(selectedOrg.created_at).toLocaleString()}</p>
                              </div>
                              <div>
                                <Label>Members</Label>
                                <p className="text-sm">{selectedOrg.member_count} active members</p>
                              </div>
                            </div>
                            {selectedOrg.description && (
                              <div>
                                <Label>Description</Label>
                                <p className="text-sm mt-1">{selectedOrg.description}</p>
                              </div>
                            )}
                            {selectedOrg.address && (
                              <div>
                                <Label>Address</Label>
                                <p className="text-sm mt-1">{selectedOrg.address}</p>
                              </div>
                            )}
                            {selectedOrg.verification_notes && (
                              <div>
                                <Label>Verification Notes</Label>
                                <p className="text-sm mt-1">{selectedOrg.verification_notes}</p>
                              </div>
                            )}
                            <div className="flex gap-2 pt-4 border-t">
                              {selectedOrg.verification_status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    disabled={actionLoading === selectedOrg.id}
                                    onClick={() => handleOrgAction(selectedOrg.id, "approve")}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={actionLoading === selectedOrg.id}
                                    onClick={() => handleOrgAction(selectedOrg.id, "reject")}
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {selectedOrg.status === "active" ? (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={actionLoading === selectedOrg.id}
                                  onClick={() => handleOrgAction(selectedOrg.id, "suspend")}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Suspend
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={actionLoading === selectedOrg.id}
                                  onClick={() => handleOrgAction(selectedOrg.id, "activate")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Activate
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {org.verification_status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          disabled={actionLoading === org.id}
                          onClick={() => handleOrgAction(org.id, "approve")}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {actionLoading === org.id ? "..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoading === org.id}
                          onClick={() => handleOrgAction(org.id, "reject")}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          {actionLoading === org.id ? "..." : "Reject"}
                        </Button>
                      </>
                    )}

                    {org.status === "active" ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === org.id}
                        onClick={() => handleOrgAction(org.id, "suspend")}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        {actionLoading === org.id ? "..." : "Suspend"}
                      </Button>
                    ) : org.status === "suspended" ? (
                      <Button
                        size="sm"
                        disabled={actionLoading === org.id}
                        onClick={() => handleOrgAction(org.id, "activate")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {actionLoading === org.id ? "..." : "Activate"}
                      </Button>
                    ) : null}
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
