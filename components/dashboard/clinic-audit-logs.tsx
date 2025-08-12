"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Filter, Download, Eye, User, Settings } from "lucide-react"

export function ClinicAuditLogs() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const mockAuditLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 14:30:25",
      user: "Dr. Sarah Smith",
      action: "patient_record_updated",
      resource: "Patient: Buddy (ID: 12345)",
      details: "Updated medical history and added vaccination record",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-01-15 13:45:12",
      user: "Mike Johnson",
      action: "user_login",
      resource: "System Access",
      details: "Successful login from front desk terminal",
      ipAddress: "192.168.1.102",
      userAgent: "Chrome/120.0.0.0",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 12:20:08",
      user: "Emma Davis",
      action: "payment_processed",
      resource: "Invoice: INV-2024-001",
      details: "Payment of $85.00 processed successfully",
      ipAddress: "192.168.1.103",
      userAgent: "Chrome/120.0.0.0",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2024-01-15 11:15:33",
      user: "System",
      action: "failed_login_attempt",
      resource: "User: unknown@example.com",
      details: "Failed login attempt with invalid credentials",
      ipAddress: "203.0.113.45",
      userAgent: "Unknown",
      severity: "warning",
    },
    {
      id: 5,
      timestamp: "2024-01-15 10:30:17",
      user: "Dr. Sarah Smith",
      action: "prescription_created",
      resource: "Patient: Luna (ID: 67890)",
      details: "Created prescription for antibiotics",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0",
      severity: "info",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "info":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <User className="h-4 w-4" />
    if (action.includes("updated") || action.includes("created")) return <FileText className="h-4 w-4" />
    if (action.includes("payment")) return <Settings className="h-4 w-4" />
    return <Eye className="h-4 w-4" />
  }

  const filteredLogs = mockAuditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterType === "all" || log.severity === filterType

    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Audit Logs
        </h2>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAuditLogs.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Actions</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAuditLogs.filter((log) => log.user !== "System").length}</div>
            <p className="text-xs text-muted-foreground">Staff activities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <Settings className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockAuditLogs.filter((log) => log.severity === "warning").length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <Settings className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockAuditLogs.filter((log) => log.severity === "error").length}
            </div>
            <p className="text-xs text-muted-foreground">Critical issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log List */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">{getActionIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      {log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(log.severity)}>{log.severity}</Badge>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{log.resource}</p>
                  <p className="text-sm">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>User: {log.user}</span>
                    <span>IP: {log.ipAddress}</span>
                    <span>Agent: {log.userAgent}</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
