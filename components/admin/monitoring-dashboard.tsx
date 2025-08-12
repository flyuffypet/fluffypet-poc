"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import { MonitoringService, type MonitoringSummary, type ErrorLog, type SystemHealthCheck } from "@/lib/monitoring"

interface MonitoringDashboardProps {
  supabaseUrl: string
  supabaseKey: string
}

export function MonitoringDashboard({ supabaseUrl, supabaseKey }: MonitoringDashboardProps) {
  const [monitoring] = useState(() => new MonitoringService(supabaseUrl, supabaseKey))
  const [summary, setSummary] = useState<MonitoringSummary[]>([])
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [health, setHealth] = useState<SystemHealthCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const loadData = async () => {
    setLoading(true)
    try {
      const [summaryData, errorsData, healthData] = await Promise.all([
        monitoring.getMonitoringSummary(),
        monitoring.getRecentErrors(20),
        monitoring.getSystemHealth(),
      ])

      setSummary(summaryData)
      setErrors(errorsData)
      setHealth(healthData)
      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to load monitoring data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "degraded":
        return "bg-yellow-500"
      case "down":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calculate overall system health
  const overallHealth =
    health.length > 0 ? (health.filter((h) => h.status === "healthy").length / health.length) * 100 : 0

  // Calculate total calls and success rate
  const totalCalls = summary.reduce((sum, s) => sum + s.total_calls, 0)
  const totalSuccessful = summary.reduce((sum, s) => sum + s.successful_calls, 0)
  const overallSuccessRate = totalCalls > 0 ? (totalSuccessful / totalCalls) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time system performance and health monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Last updated: {lastRefresh.toLocaleTimeString()}</span>
          <Button onClick={loadData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealth.toFixed(1)}%</div>
            <Progress value={overallHealth} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSuccessRate.toFixed(1)}%</div>
            <Progress value={overallSuccessRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errors.length}</div>
            <p className="text-xs text-muted-foreground">Last 50 errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Monitoring */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Edge Function Performance</CardTitle>
              <CardDescription>Performance metrics for all Edge Functions over the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{metric.function_name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{metric.total_calls} calls</span>
                        <span>{metric.avg_response_time}ms avg</span>
                        <span>P95: {metric.p95_response_time}ms</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={metric.success_rate_percent >= 99 ? "default" : "destructive"}>
                        {metric.success_rate_percent}% success
                      </Badge>
                    </div>
                  </div>
                ))}
                {summary.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No performance data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Status</CardTitle>
              <CardDescription>Current health status of all monitored services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {health.map((check, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <h4 className="font-medium">{check.service_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {check.response_time_ms ? `${check.response_time_ms}ms response time` : "No response time"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={check.status === "healthy" ? "default" : "destructive"}
                      className={getStatusColor(check.status)}
                    >
                      {check.status}
                    </Badge>
                  </div>
                ))}
                {health.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No health check data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Error Logs</CardTitle>
              <CardDescription>Latest errors and exceptions from Edge Functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {errors.map((error, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-red-600">{error.function_name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {new Date(error.created_at!).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{error.error_message}</p>
                    {error.stack_trace && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground">Stack trace</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{error.stack_trace}</pre>
                      </details>
                    )}
                  </div>
                ))}
                {errors.length === 0 && <p className="text-center text-muted-foreground py-8">No recent errors</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
