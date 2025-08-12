import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, Server, AlertTriangle, CheckCircle } from "lucide-react"

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All sensitive data is encrypted both in transit and at rest using industry-standard AES-256 encryption.",
      status: "Active",
    },
    {
      icon: Shield,
      title: "Multi-Factor Authentication",
      description: "Optional 2FA protection for all user accounts using TOTP or SMS verification.",
      status: "Available",
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description:
        "Granular privacy settings allow users to control what information is shared with service providers.",
      status: "Active",
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade cloud infrastructure with 99.9% uptime and automatic backups.",
      status: "Active",
    },
  ]

  const complianceStandards = [
    { name: "SOC 2 Type II", status: "Compliant", description: "Security, availability, and confidentiality controls" },
    { name: "GDPR", status: "Compliant", description: "European data protection regulation compliance" },
    { name: "CCPA", status: "Compliant", description: "California Consumer Privacy Act compliance" },
    { name: "HIPAA", status: "Aligned", description: "Healthcare data protection best practices" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Security Practices</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trust is our priority. Learn about the comprehensive security measures we implement to protect your
            data and privacy.
          </p>
        </div>

        {/* Security Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Data Protection */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Encryption Standards</h3>
                  <p className="text-sm text-gray-600">
                    All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. Encryption keys are
                    managed using industry best practices.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Access Controls</h3>
                  <p className="text-sm text-gray-600">
                    Role-based access controls ensure that users can only access data they are authorized to view.
                    Regular access reviews are conducted.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Data Retention</h3>
                  <p className="text-sm text-gray-600">
                    Data is retained only as long as necessary for service provision and legal compliance. Users can
                    request data deletion at any time.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Incident Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">24/7 Monitoring</h3>
                  <p className="text-sm text-gray-600">
                    Our security team monitors systems around the clock for potential threats and anomalous activity.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Rapid Response</h3>
                  <p className="text-sm text-gray-600">
                    In the event of a security incident, our response team follows established procedures to contain and
                    resolve issues quickly.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Transparency</h3>
                  <p className="text-sm text-gray-600">
                    We commit to transparent communication about any security incidents that may affect user data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Compliance */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Compliance Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {complianceStandards.map((standard) => (
              <Card key={standard.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{standard.name}</h3>
                    <Badge
                      variant={standard.status === "Compliant" ? "default" : "secondary"}
                      className={standard.status === "Compliant" ? "bg-green-100 text-green-800" : ""}
                    >
                      {standard.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Security Contact */}
        <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Report Security Issues</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you discover a security vulnerability, please report it to our security team immediately. We appreciate
            responsible disclosure and will work with you to address any issues.
          </p>
          <div className="space-y-2">
            <p className="font-medium">Security Email: security@fluffypet.com</p>
            <p className="text-sm text-gray-600">
              For sensitive reports, please use our PGP key available on our contact page.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Security Practices - FluffyPet",
  description: "Learn about FluffyPet's comprehensive security measures and data protection practices.",
}
