import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react"

export default function StatusPage() {
  // Mock status data - in production this would come from a status monitoring service
  const systemStatus = {
    overall: "operational",
    lastUpdated: new Date().toISOString(),
  }

  const services = [
    {
      name: "Web Application",
      status: "operational",
      uptime: "99.98%",
      responseTime: "245ms",
    },
    {
      name: "API Services",
      status: "operational",
      uptime: "99.95%",
      responseTime: "120ms",
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      responseTime: "15ms",
    },
    {
      name: "File Storage",
      status: "operational",
      uptime: "99.97%",
      responseTime: "180ms",
    },
    {
      name: "Real-time Chat",
      status: "operational",
      uptime: "99.92%",
      responseTime: "95ms",
    },
    {
      name: "Payment Processing",
      status: "operational",
      uptime: "99.96%",
      responseTime: "320ms",
    },
  ]

  const recentIncidents = [
    {
      id: 1,
      title: "Scheduled Maintenance - Database Optimization",
      status: "resolved",
      date: "2024-01-10",
      duration: "30 minutes",
      impact: "low",
    },
    {
      id: 2,
      title: "Intermittent API Slowdowns",
      status: "resolved",
      date: "2024-01-05",
      duration: "45 minutes",
      impact: "medium",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "outage":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "maintenance":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      case "outage":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            {getStatusIcon(systemStatus.overall)}
            <h1 className="text-4xl font-bold">System Status</h1>
          </div>
          <p className="text-xl text-gray-600">Current status of FluffyPet services and infrastructure</p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(systemStatus.overall)}
              Overall System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(systemStatus.overall)}>
                {systemStatus.overall.charAt(0).toUpperCase() + systemStatus.overall.slice(1)}
              </Badge>
              <span className="text-gray-600">All systems are operating normally</span>
            </div>
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <Badge className={`${getStatusColor(service.status)} text-xs`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Uptime: {service.uptime}</div>
                    <div>Response: {service.responseTime}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            {recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{incident.title}</h3>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Date: {new Date(incident.date).toLocaleDateString()}</div>
                      <div>Duration: {incident.duration}</div>
                      <div>Impact: {incident.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <p>No recent incidents to report</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscribe to Updates */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to stay updated on system status? Subscribe to our status page for real-time notifications.
          </p>
          <p className="text-sm text-gray-500">
            For technical support, please visit our{" "}
            <a href="/help" className="text-blue-600 hover:underline">
              Help Center
            </a>{" "}
            or{" "}
            <a href="/contact" className="text-blue-600 hover:underline">
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "System Status - FluffyPet",
  description: "Current status of FluffyPet services and infrastructure.",
}
