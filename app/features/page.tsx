import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Brain,
  Calendar,
  MessageCircle,
  Shield,
  MapPin,
  CreditCard,
  Users,
  Heart,
  Camera,
  Bell,
  Search,
  Star,
} from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations for your pet's health, behavior, and care needs",
      category: "AI & Analytics",
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "Book appointments with vets, groomers, and trainers with real-time availability",
      category: "Scheduling",
    },
    {
      icon: MessageCircle,
      title: "Real-time Communication",
      description: "Secure messaging between pet owners and service providers",
      category: "Communication",
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "End-to-end encryption for all medical records and personal data",
      category: "Security",
    },
    {
      icon: MapPin,
      title: "Location-based Discovery",
      description: "Find nearby vets, services, and pet-friendly places with integrated maps",
      category: "Discovery",
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Integrated payment processing with multiple payment methods",
      category: "Payments",
    },
    {
      icon: Users,
      title: "Multi-tenant Organizations",
      description: "Manage clinics, NGOs, and service businesses with team collaboration",
      category: "Organizations",
    },
    {
      icon: Heart,
      title: "Adoption & Rescue",
      description: "Connect with NGOs and facilitate pet adoptions and rescue operations",
      category: "Rescue",
    },
    {
      icon: Camera,
      title: "Media Management",
      description: "Secure photo and document storage with controlled access",
      category: "Media",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated reminders for vaccinations, appointments, and medications",
      category: "Notifications",
    },
    {
      icon: Search,
      title: "Lost & Found Network",
      description: "Community-driven lost pet alerts with geo-location matching",
      category: "Community",
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Transparent feedback system for all service providers",
      category: "Reviews",
    },
  ]

  const categories = [...new Set(features.map((f) => f.category))]

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Platform Features</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to provide comprehensive pet care in one secure, integrated platform
        </p>
      </section>

      {/* Feature Categories */}
      <section className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features
                .filter((feature) => feature.category === category)
                .map((feature, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Role-specific Features */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">Features by User Type</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Link href="/features/owners" className="hover:text-blue-600 transition-colors">
                  Pet Owner Features →
                </Link>
              </CardTitle>
              <CardDescription>Comprehensive pet management, booking, and health tracking</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Link href="/features/vets" className="hover:text-blue-600 transition-colors">
                  Veterinarian Features →
                </Link>
              </CardTitle>
              <CardDescription>Practice management, patient records, and appointment scheduling</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Link href="/features/ngo" className="hover:text-blue-600 transition-colors">
                  NGO & Rescue Features →
                </Link>
              </CardTitle>
              <CardDescription>Rescue management, adoption facilitation, and volunteer coordination</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <Link href="/features/providers" className="hover:text-blue-600 transition-colors">
                  Service Provider Features →
                </Link>
              </CardTitle>
              <CardDescription>Business management for groomers, trainers, walkers, and boarding</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold">Experience All Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start your free account and explore how FluffyPet can transform your pet care experience
        </p>
        <Button asChild size="lg">
          <Link href="/signup">Start Free Trial</Link>
        </Button>
      </section>
    </div>
  )
}
