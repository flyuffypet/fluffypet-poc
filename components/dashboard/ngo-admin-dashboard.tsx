"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Heart, DollarSign, Shield, AlertTriangle, CheckCircle } from "lucide-react"

export function NGOAdminDashboard() {
  const [activeTab, setActiveTab] = useState("rescue-board")

  const mockRescueCases = [
    {
      id: 1,
      name: "Injured Stray Dog",
      location: "Downtown Park",
      priority: "high",
      status: "new",
      assignee: "Volunteer Team A",
      reportedDate: "2024-01-15",
      estimatedCost: 250,
    },
    {
      id: 2,
      name: "Abandoned Puppies",
      location: "Industrial Area",
      priority: "urgent",
      status: "in-rescue",
      assignee: "Sarah Wilson",
      reportedDate: "2024-01-14",
      estimatedCost: 400,
    },
    {
      id: 3,
      name: "Senior Cat",
      location: "Residential Street",
      priority: "medium",
      status: "recovered",
      assignee: "Mike Chen",
      reportedDate: "2024-01-12",
      estimatedCost: 150,
    },
  ]

  const mockAdoptionApplicants = [
    {
      id: 1,
      applicantName: "Emma Davis",
      petInterested: "Luna (Cat)",
      stage: "application-review",
      submittedDate: "2024-01-10",
      phone: "(555) 123-4567",
      homeCheck: "pending",
    },
    {
      id: 2,
      applicantName: "John Smith",
      petInterested: "Buddy (Dog)",
      stage: "home-check",
      submittedDate: "2024-01-08",
      phone: "(555) 987-6543",
      homeCheck: "scheduled",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "secondary"
      case "in-rescue":
        return "default"
      case "recovered":
        return "default"
      case "adopted":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="h-6 w-6 text-red-500" />
          NGO Administration
        </h1>
        <Button>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Emergency
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="rescue-board">Rescue Board</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="intake">Intake</TabsTrigger>
          <TabsTrigger value="adoption">Adoption</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="rescue-board" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockRescueCases.length}</div>
                <p className="text-xs text-muted-foreground">Rescue operations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Cases</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {mockRescueCases.filter((c) => c.priority === "urgent").length}
                </div>
                <p className="text-xs text-muted-foreground">Need immediate attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recovered</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mockRescueCases.filter((c) => c.status === "recovered").length}
                </div>
                <p className="text-xs text-muted-foreground">Ready for adoption</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimated Costs</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${mockRescueCases.reduce((sum, c) => sum + c.estimatedCost, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total rescue costs</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rescue Case Kanban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <h4 className="font-medium mb-3 text-center">New Cases</h4>
                  <div className="space-y-2">
                    {mockRescueCases
                      .filter((c) => c.status === "new")
                      .map((case_) => (
                        <Card key={case_.id} className="p-3">
                          <h5 className="font-medium text-sm">{case_.name}</h5>
                          <p className="text-xs text-muted-foreground">{case_.location}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant={getPriorityColor(case_.priority)} className="text-xs">
                              {case_.priority}
                            </Badge>
                            <span className="text-xs">${case_.estimatedCost}</span>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-center">In Rescue</h4>
                  <div className="space-y-2">
                    {mockRescueCases
                      .filter((c) => c.status === "in-rescue")
                      .map((case_) => (
                        <Card key={case_.id} className="p-3">
                          <h5 className="font-medium text-sm">{case_.name}</h5>
                          <p className="text-xs text-muted-foreground">{case_.assignee}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant={getPriorityColor(case_.priority)} className="text-xs">
                              {case_.priority}
                            </Badge>
                            <span className="text-xs">${case_.estimatedCost}</span>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-center">Recovered</h4>
                  <div className="space-y-2">
                    {mockRescueCases
                      .filter((c) => c.status === "recovered")
                      .map((case_) => (
                        <Card key={case_.id} className="p-3">
                          <h5 className="font-medium text-sm">{case_.name}</h5>
                          <p className="text-xs text-muted-foreground">Ready for adoption</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="default" className="text-xs">
                              recovered
                            </Badge>
                            <span className="text-xs">${case_.estimatedCost}</span>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-center">Adopted</h4>
                  <div className="space-y-2">
                    <div className="text-center py-8 text-muted-foreground">
                      <Heart className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Success stories</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="adoption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Adoption Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAdoptionApplicants.map((applicant) => (
                  <div key={applicant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{applicant.applicantName}</h4>
                      <p className="text-sm text-muted-foreground">Interested in: {applicant.petInterested}</p>
                      <p className="text-xs text-muted-foreground">
                        Applied: {new Date(applicant.submittedDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{applicant.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant="default">{applicant.stage.replace("-", " ")}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Home check: {applicant.homeCheck}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          Schedule
                        </Button>
                        <Button size="sm">Approve</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Active Volunteers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">Currently available</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shift Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <Progress value={85} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Training Needed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">New volunteers</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donations & Sponsors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Monthly Donations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12,450</div>
                    <p className="text-xs text-green-600">+15% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Active Sponsors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">Corporate partners</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Fundraising Goal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">68%</div>
                    <Progress value={68} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance & Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">License Renewal</h4>
                      <Badge variant="default">Valid</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Expires: March 2024</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Insurance Coverage</h4>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Policy: NGO-2024-001</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Annual Report</h4>
                      <Badge variant="secondary">Due Soon</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Due: February 2024</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Tax Exemption</h4>
                      <Badge variant="default">Valid</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">501(c)(3) Status</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
