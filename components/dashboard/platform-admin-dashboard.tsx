"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Eye,
  Key,
  Database,
  Activity,
  Building2,
  UserCheck,
} from "lucide-react"
// Import the new UserManagement component
import { UserManagement } from "@/components/admin/user-management"
// Import the new OrganizationManagement component
import { OrganizationManagement } from "@/components/admin/organization-management"
// Import the new AuditLogging component
import { AuditLogging } from "@/components/admin/audit-logging"

export function PlatformAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const mockStats = {
    totalUsers: 15247,
    totalOrganizations: 1247,
    monthlyActiveUsers: 8934,
    totalBookings: 45678,
    totalRevenue: 234567,
    growthRate: 12.5,
    churnRate: 2.3,
    pendingVerifications: 23,
    activeReports: 8,
  }

  const mockVerificationQueue = [
    {
      id: 1,
      orgName: "Happy Paws Veterinary Clinic",
      type: "vet_clinic",
      submittedDate: "2024-01-15",
      status: "pending",
      documents: ["license", "insurance", "certifications"],
      priority: "high",
      contactEmail: "admin@happypaws.com",
    },
    {
      id: 2,
      orgName: "Rescue Angels NGO",
      type: "ngo",
      submittedDate: "2024-01-14",
      status: "under_review",
      documents: ["501c3", "board_resolution", "financial_statements"],
      priority: "medium",
      contactEmail: "contact@rescueangels.org",
    },
    {
      id: 3,
      orgName: "Paws & Claws Grooming",
      type: "grooming_salon",
      submittedDate: "2024-01-13",
      status: "pending",
      documents: ["business_license", "insurance"],
      priority: "low",
      contactEmail: "info@pawsclaws.com",
    },
  ]

  const mockUsers = [
    {
      id: "user_1",
      email: "john.doe@example.com",
      name: "John Doe",
      role: "pet_owner",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-15",
      totalBookings: 12,
    },
    {
      id: "user_2",
      email: "dr.smith@vetclinic.com",
      name: "Dr. Sarah Smith",
      role: "veterinarian",
      status: "active",
      joinDate: "2023-12-15",
      lastActive: "2024-01-15",
      totalBookings: 156,
    },
    {
      id: "user_3",
      email: "groomer@pawspa.com",
      name: "Mike Johnson",
      role: "service_provider",
      status: "suspended",
      joinDate: "2023-11-20",
      lastActive: "2024-01-10",
      totalBookings: 89,
    },
  ]

  const mockReports = [
    {
      id: 1,
      type: "inappropriate_content",
      reportedBy: "user_12345",
      targetUser: "provider_67890",
      content: "Inappropriate service description",
      status: "pending",
      severity: "medium",
      submittedDate: "2024-01-15",
    },
    {
      id: 2,
      type: "fake_profile",
      reportedBy: "user_54321",
      targetUser: "vet_98765",
      content: "Suspected fake veterinarian profile",
      status: "investigating",
      severity: "high",
      submittedDate: "2024-01-14",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "pending":
        return "secondary"
      case "under_review":
        return "default"
      case "approved":
        return "default"
      case "rejected":
        return "destructive"
      case "suspended":
        return "destructive"
      case "investigating":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          FluffyPet Admin Dashboard
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Database className="h-4 w-4 mr-2" />
            System Health
          </Button>
          <Button variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Actions
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Added audit tab to the tabs list */}
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600">+{mockStats.growthRate}% growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.totalOrganizations.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{mockStats.pendingVerifications} pending</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Active</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockStats.monthlyActiveUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{mockStats.churnRate}% churn rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${mockStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600">+22% this quarter</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">New organization verified</p>
                      <p className="text-xs text-muted-foreground">Happy Paws Veterinary approved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Content report received</p>
                      <p className="text-xs text-muted-foreground">Inappropriate profile content</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">User milestone reached</p>
                      <p className="text-xs text-muted-foreground">15,000 registered users</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>API Response Time</span>
                      <span>145ms</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Database Performance</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>System Uptime</span>
                      <span>99.9%</span>
                    </div>
                    <Progress value={99.9} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* Replace mock user management with real UserManagement component */}
          <UserManagement />
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          {/* Replace mock organization management with real OrganizationManagement component */}
          <OrganizationManagement />
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockVerificationQueue.length}</div>
                <p className="text-xs text-muted-foreground">Organizations waiting</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {mockVerificationQueue.filter((v) => v.priority === "high").length}
                </div>
                <p className="text-xs text-muted-foreground">Urgent reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3 days</div>
                <p className="text-xs text-green-600">-0.5 days from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">87%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Verification Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVerificationQueue.map((org) => (
                  <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{org.orgName}</h4>
                      <p className="text-sm text-muted-foreground">{org.contactEmail}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {org.type.replace("_", " ")}
                        </Badge>
                        <Badge variant={getStatusColor(org.status)} className="text-xs">
                          {org.status.replace("_", " ")}
                        </Badge>
                        <Badge variant={getPriorityColor(org.priority)} className="text-xs">
                          {org.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(org.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium capitalize">{report.type.replace("_", " ")}</h4>
                      <p className="text-sm text-muted-foreground">{report.content}</p>
                      <p className="text-xs text-muted-foreground">
                        Reported by: {report.reportedBy} • Target: {report.targetUser}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={getPriorityColor(report.severity)}>{report.severity}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{report.status.replace("_", " ")}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                        <Button size="sm" variant="destructive">
                          Take Action
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Added new audit logs tab content */}
        <TabsContent value="audit" className="space-y-4">
          <AuditLogging />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Security Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">RLS Policy Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Policies</span>
                      <Badge variant="default">47</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Policy Violations</span>
                      <Badge variant="destructive">0</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Service Keys</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Keys</span>
                      <Badge variant="default">12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expiring Soon</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                  </div>
                  <Button size="sm" className="mt-2">
                    Rotate Keys
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
