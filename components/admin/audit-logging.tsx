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
  FileText,
  Search,
  Download,
  Eye,
  User,
  Shield,
  Activity,
  AlertTriangle,
  Calendar,
  Database,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"

interface AuditLog {
  id: string
  actor_id?: string
  action: string
  entity_type?: string
  entity_id?: string
  details?: any
  ip_address?: string
  user_agent?: string
  created_at: string
  actor_email?: string
  actor_name?: string
  severity?: string
}

export function AuditLogging() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [showLogDetails, setShowLogDetails] = useState(false)

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    loadAuditLogs()
  }, [])

  const loadAuditLogs = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("audit_logs")
        .select(`
          id,
          actor_id,
          action,
          entity_type,
          entity_id,
          details,
          ip_address,
          user_agent,
          created_at,
          profiles:actor_id(email, first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error

      // Transform data to include actor info and severity
      const transformedData =
        data?.map((log: any) => ({
          ...log,
          actor_email: log.profiles?.email,
          actor_name: log.profiles?.first_name
            ? `${log.profiles.first_name} ${log.profiles.last_name || ""}`.trim()
            : log.profiles?.email || "System",
          severity: determineSeverity(log.action, log.details),
        })) || []

      setAuditLogs(transformedData)
    } catch (error) {
      console.error("Error loading audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const determineSeverity = (action: string, details: any): string => {
    // Determine severity based on action type
    if (action.includes("delete") || action.includes("suspend") || action.includes("ban")) {
      return "error"
    }
    if (action.includes("failed") || action.includes("reject") || action.includes("warning")) {
      return "warning"
    }
    return "info"
  }

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_id?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = actionFilter === "all" || log.action?.includes(actionFilter)
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter
    const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter

    return matchesSearch && matchesAction && matchesSeverity && matchesEntity
  })

  const exportAuditLogs = () => {
    const csvContent = [
      ["Timestamp", "Actor", "Action", "Entity Type", "Entity ID", "IP Address", "Severity"].join(","),
      ...filteredLogs.map((log) =>
        [
          new Date(log.created_at).toISOString(),
          log.actor_name || "System",
          log.action,
          log.entity_type || "",
          log.entity_id || "",
          log.ip_address || "",
          log.severity || "info",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-logs-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
      default:
        return "default"
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes("login") || action.includes("auth")) return <User className="h-4 w-4" />
    if (action.includes("create") || action.includes("update")) return <FileText className="h-4 w-4" />
    if (action.includes("delete") || action.includes("suspend")) return <AlertTriangle className="h-4 w-4" />
    if (action.includes("admin") || action.includes("role")) return <Shield className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const logStats = {
    total: auditLogs.length,
    errors: auditLogs.filter((log) => log.severity === "error").length,
    warnings: auditLogs.filter((log) => log.severity === "warning").length,
    userActions: auditLogs.filter((log) => log.actor_id).length,
    systemActions: auditLogs.filter((log) => !log.actor_id).length,
    todayActions: auditLogs.filter((log) => {
      const today = new Date()
      const logDate = new Date(log.created_at)
      return logDate.toDateString() === today.toDateString()
    }).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading audit logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.todayActions}</div>
            <p className="text-xs text-muted-foreground">Events today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Actions</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.userActions}</div>
            <p className="text-xs text-muted-foreground">By users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Actions</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logStats.systemActions}</div>
            <p className="text-xs text-muted-foreground">Automated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{logStats.warnings}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{logStats.errors}</div>
            <p className="text-xs text-muted-foreground">Critical issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Platform Audit Logs</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportAuditLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={loadAuditLogs}>
                <Activity className="h-4 w-4 mr-2" />
                Refresh
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
                placeholder="Search logs by action, user, or entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="user">Users</SelectItem>
                <SelectItem value="organization">Organizations</SelectItem>
                <SelectItem value="pet">Pets</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Log List */}
          <div className="space-y-4">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>No audit logs found matching your criteria</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getActionIcon(log.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">
                        {log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(log.severity)}>{log.severity}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {log.entity_type && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {log.entity_type}: {log.entity_id}
                      </p>
                    )}
                    {log.details && typeof log.details === "object" && (
                      <p className="text-sm mb-2">{JSON.stringify(log.details, null, 2).slice(0, 100)}...</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Actor: {log.actor_name || "System"}</span>
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                      {log.user_agent && <span>Agent: {log.user_agent.slice(0, 30)}...</span>}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Dialog
                      open={showLogDetails && selectedLog?.id === log.id}
                      onOpenChange={(open) => {
                        setShowLogDetails(open)
                        if (!open) setSelectedLog(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Audit Log Details</DialogTitle>
                        </DialogHeader>
                        {selectedLog && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Action</Label>
                                <p className="text-sm font-medium">{selectedLog.action}</p>
                              </div>
                              <div>
                                <Label>Severity</Label>
                                <Badge variant={getSeverityColor(selectedLog.severity)}>{selectedLog.severity}</Badge>
                              </div>
                              <div>
                                <Label>Actor</Label>
                                <p className="text-sm">{selectedLog.actor_name || "System"}</p>
                              </div>
                              <div>
                                <Label>Timestamp</Label>
                                <p className="text-sm">{new Date(selectedLog.created_at).toLocaleString()}</p>
                              </div>
                              <div>
                                <Label>Entity Type</Label>
                                <p className="text-sm">{selectedLog.entity_type || "N/A"}</p>
                              </div>
                              <div>
                                <Label>Entity ID</Label>
                                <p className="text-sm">{selectedLog.entity_id || "N/A"}</p>
                              </div>
                              <div>
                                <Label>IP Address</Label>
                                <p className="text-sm">{selectedLog.ip_address || "N/A"}</p>
                              </div>
                              <div>
                                <Label>User Agent</Label>
                                <p className="text-sm">{selectedLog.user_agent || "N/A"}</p>
                              </div>
                            </div>
                            {selectedLog.details && (
                              <div>
                                <Label>Details</Label>
                                <pre className="text-sm mt-1 p-2 bg-muted rounded overflow-auto max-h-40">
                                  {JSON.stringify(selectedLog.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
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
