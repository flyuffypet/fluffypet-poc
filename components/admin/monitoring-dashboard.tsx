"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, RefreshCw, Server, Zap } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase-client"
import { EdgeFunctionMonitor } from "@/lib/monitoring"

interface MetricData {
  function_name: string
  action: string
  total_calls: number
  avg_duration: number
  success_rate: number
  error_count: number
  p95_duration: number
}

interface HealthCheck {
  service_name: string
  status: string
  avg_response_time: number
  last_check: string
  healthy_count: number
  degraded_count: number
  down_count: number
}

export default function MonitoringDashboard() {
  const supabase = getSupabaseBrowserClient()
  const monitor = EdgeFunctionMonitor.getInstance()

  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    loadDashboardData()

    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load Edge Function performance metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from("edge_function_performance")
        .select("*")
        .order("hour", { ascending: false })
        .limit(20)

      if (metricsError) throw metricsError
      setMetrics(metricsData || [])

      // Load system health checks
      const { data: healthData, error: healthError } = await supabase
        .from("system_health_summary")
        .select("*")
        .order("service_name")

      if (healthError) throw healthError
      setHealthChecks(healthData || [])

      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

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
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">Last updated: {formatTimestamp(lastRefresh.toISOString())}</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="functions">Edge Functions</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="errors">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Status Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.reduce((sum, m) => sum + m.total_calls, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.length > 0
                    ? formatDuration(metrics.reduce((sum, m) => sum + m.avg_duration, 0) / metrics.length)
                    : "0ms"}
                </div>
                <p className="text-xs text-muted-foreground">Across all functions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.length > 0
                    ? `${(metrics.reduce((sum, m) => sum + m.success_rate, 0) / metrics.length).toFixed(1)}%`
                    : "100%"}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Error Count</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.reduce((sum, m) => sum + m.error_count, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Service Health Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Service Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {healthChecks.map((health) => (
                  <div key={health.service_name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(health.status)}
                      <span className="font-medium">{health.service_name}</span>
                    </div>
                    <Badge variant={health.status === "healthy" ? "default" : "destructive"}>{health.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="functions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Edge Function Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{metric.function_name}</Badge>
                        <span className="text-sm text-muted-foreground">{metric.action}</span>
                      </div>
                      <Badge variant={metric.success_rate > 95 ? "default" : "destructive"}>
                        {metric.success_rate.toFixed(1)}% success
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Calls:</span>
                        <div className="font-medium">{metric.total_calls.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <div className="font-medium">{formatDuration(metric.avg_duration)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">P95 Duration:</span>
                        <div className="font-medium">{formatDuration(metric.p95_duration)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Errors:</span>
                        <div className="font-medium text-red-600">{metric.error_count}</div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <Progress value={metric.success_rate} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthChecks.map((health) => (
                  <div key={health.service_name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(health.status)}
                        <span className="font-medium">{health.service_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={health.status === "healthy" ? "default" : "destructive"}>{health.status}</Badge>
                        <span className="text-sm text-muted-foreground">{formatTimestamp(health.last_check)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Response Time:</span>
                        <div className="font-medium">{formatDuration(health.avg_response_time)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Healthy:</span>
                        <div className="font-medium text-green-600">{health.healthy_count}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Degraded:</span>
                        <div className="font-medium text-yellow-600">{health.degraded_count}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Down:</span>
                        <div className="font-medium text-red-600">{health.down_count}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>Error log component will be implemented here</p>
                <p className="text-sm">This will show recent errors from Edge Functions</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
