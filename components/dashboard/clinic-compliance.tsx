"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Upload, CheckCircle, AlertTriangle } from "lucide-react"

export function ClinicCompliance() {
  const mockComplianceItems = [
    {
      id: 1,
      name: "Veterinary License",
      type: "license",
      status: "valid",
      expiryDate: "2024-12-31",
      lastUpdated: "2024-01-01",
      documents: ["license.pdf"],
    },
    {
      id: 2,
      name: "DEA Registration",
      type: "registration",
      status: "expiring_soon",
      expiryDate: "2024-03-15",
      lastUpdated: "2023-03-15",
      documents: ["dea_cert.pdf"],
    },
    {
      id: 3,
      name: "Liability Insurance",
      type: "insurance",
      status: "valid",
      expiryDate: "2024-08-30",
      lastUpdated: "2023-08-30",
      documents: ["insurance_policy.pdf"],
    },
    {
      id: 4,
      name: "OSHA Compliance",
      type: "safety",
      status: "needs_renewal",
      expiryDate: "2024-02-01",
      lastUpdated: "2023-02-01",
      documents: ["osha_cert.pdf"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "default"
      case "expiring_soon":
        return "secondary"
      case "needs_renewal":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "expiring_soon":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "needs_renewal":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance & Verification
        </h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockComplianceItems.length}</div>
            <p className="text-xs text-muted-foreground">Compliance items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockComplianceItems.filter((item) => item.status === "valid").length}
            </div>
            <p className="text-xs text-muted-foreground">Up to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockComplianceItems.filter((item) => item.status === "expiring_soon").length}
            </div>
            <p className="text-xs text-muted-foreground">Within 60 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Renewal</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockComplianceItems.filter((item) => item.status === "needs_renewal").length}
            </div>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Items */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockComplianceItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">{item.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={getStatusColor(item.status)}>{item.status.replace("_", " ")}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.documents.length} document{item.documents.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                    {item.status !== "valid" && <Button size="sm">Renew</Button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Platform Verification</h4>
                <Badge variant="default">Verified</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Your clinic has been verified by the platform administrators.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Insurance Coverage</h4>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Professional liability insurance is current and verified.</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Background Checks</h4>
                <Badge variant="default">Complete</Badge>
              </div>
              <p className="text-sm text-muted-foreground">All staff background checks are up to date.</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Continuing Education</h4>
                <Badge variant="secondary">In Progress</Badge>
              </div>
              <p className="text-sm text-muted-foreground">CE credits: 15/20 required for this period.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
