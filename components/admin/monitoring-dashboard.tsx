"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
  RefreshCw,
  Zap,
  Database,
  MessageSquare,
  Brain,
} from "lucide-react"
import { monitoring, type ErrorLog } from "@/lib/monitoring"

interface MetricsSummary {
  totalRequests: number
  successRate: number
  avgResponseTime: number
  p95ResponseTime: number
  p99ResponseTime: number
  errorCount: number
}

interface SystemHealth {
  services: Array<{
    name: string
    status: "healthy" | "degraded" | "down"
    lastCheck: string
    responseTime: number
  }>
  overallStatus: "healthy" | "degraded" | "down"
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Record<string, MetricsSummary>>({})
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [recentErrors, setRecentErrors] = useState<ErrorLog[]>([])
  const [timeRange, setTimeRange] = useState<"hour" | "day" | "week">("hour")
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const edgeFunctions = ["auth", "media", "chat", "ai"]

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch metrics for each Edge Function
      const metricsPromises = edgeFunctions.map(async (func) => {
        const data = await monitoring.getMetrics(func, timeRange)
        return [func, data] as [string, MetricsSummary]
      })

      const metricsResults = await Promise.all(metricsPromises)
      const metricsMap = Object.fromEntries(metricsResults)

      // Fetch overall metrics
      const overallMetrics = await monitoring.getMetrics(undefined, timeRange)
      metricsMap["overall"] = overallMetrics

      setMetrics(metricsMap)

      // Fetch system health
      const health = await monitoring.getSystemHealth()
      setSystemHealth(health)

      // Fetch recent errors
      const errors = await monitoring.getRecentErrors(20)
      setRecentErrors(errors)

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [timeRange])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "degraded":
        return "text-yellow-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getFunctionIcon = (functionName: string) => {
    switch (functionName) {
      case "auth":
        return <Zap className="h-4 w-4" />
      case "media":
        return <Database className="h-4 w-4" />
      case "chat":
        return <MessageSquare className="h-4 w-4" />
      case "ai":
        return <Brain className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading && Object.keys(metrics).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time performance metrics and system health</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <Button onClick={fetchData} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
        <TabsList>
          <TabsTrigger value="hour">Last Hour</TabsTrigger>
          <TabsTrigger value="day">Last 24 Hours</TabsTrigger>
          <TabsTrigger value="week">Last Week</TabsTrigger>
        </TabsList>

        <TabsContent value={timeRange} className="space-y-6">
          {/* System Health Overview */}
          {systemHealth && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(systemHealth.overallStatus)}
                  System Health
                </CardTitle>
                <CardDescription>Overall system status and service health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {systemHealth.services.map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {getFunctionIcon(service.name)}
                        <span className="font-medium capitalize">{service.name}</span>
                      </div>
                      <div className="text-right">
                        <Badge variant={service.status === "healthy" ? "default" : "destructive"}>
                          {service.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">{formatTime(service.responseTime)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overall Metrics */}
          {metrics.overall && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.overall.totalRequests.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metrics.overall.successRate.toFixed(1)}%</div>
                  <Progress value={metrics.overall.successRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatTime(metrics.overall.avgResponseTime)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Error Count</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{metrics.overall.errorCount}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edge Function Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Edge Function Performance</CardTitle>
              <CardDescription>Performance breakdown by Edge Function</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {edgeFunctions.map((func) => {
                  const metric = metrics[func]
                  if (!metric) return null

                  return (
                    <div key={func} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getFunctionIcon(func)}
                        <h3 className="font-semibold capitalize">{func} Function</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Requests</div>
                          <div className="font-medium">{metric.totalRequests}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Success Rate</div>
                          <div className="font-medium">{metric.successRate.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Time</div>
                          <div className="font-medium">{formatTime(metric.avgResponseTime)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">P95 Time</div>
                          <div className="font-medium">{formatTime(metric.p95ResponseTime)}</div>
                        </div>
                      </div>

                      <Progress value={metric.successRate} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Errors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Errors
              </CardTitle>
              <CardDescription>Latest error logs from Edge Functions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {recentErrors.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No recent errors found</div>
                ) : (
                  <div className="space-y-3">
                    {recentErrors.map((error) => (
                      <div key={error.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getFunctionIcon(error.function_name)}
                            <span className="font-medium">{error.function_name}</span>
                            <Badge variant="outline">{error.action}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{formatDate(error.created_at!)}</div>
                        </div>
                        <div className="text-sm text-red-600">{error.error_message}</div>
                        {error.stack_trace && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Stack trace</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{error.stack_trace}</pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
