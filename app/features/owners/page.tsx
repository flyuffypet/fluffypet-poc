import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Heart,
  Calendar,
  MessageCircle,
  Camera,
  Bell,
  MapPin,
  Shield,
  FileText,
  Users,
  Star,
  CreditCard,
  Search,
} from "lucide-react"

export default function OwnerFeaturesPage() {
  const features = [
    {
      icon: Heart,
      title: "Complete Pet Profiles",
      description: "Create detailed profiles for each pet with photos, medical history, preferences, and notes",
      benefits: ["Secure medical records", "Photo galleries", "Vaccination tracking", "Allergy management"],
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "Book appointments with vets, groomers, trainers, and other services in just a few clicks",
      benefits: ["Real-time availability", "Automated reminders", "Recurring appointments", "Cancellation protection"],
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Chat directly with service providers, vets, and other pet owners in your network",
      benefits: ["Secure messaging", "Photo sharing", "Appointment coordination", "Emergency contacts"],
    },
    {
      icon: Camera,
      title: "Media Management",
      description: "Store and organize photos, videos, and documents with controlled sharing permissions",
      benefits: ["Unlimited storage", "Automatic backup", "Selective sharing", "Medical document storage"],
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss important appointments, medications, or health checkups with intelligent notifications",
      benefits: ["Vaccination alerts", "Medication reminders", "Appointment notifications", "Health milestones"],
    },
    {
      icon: MapPin,
      title: "Local Discovery",
      description: "Find trusted vets, services, and pet-friendly places near you with reviews and ratings",
      benefits: ["Location-based search", "Verified reviews", "Distance tracking", "Emergency services"],
    },
    {
      icon: Shield,
      title: "Privacy Control",
      description: "You control who sees what information about your pets with granular privacy settings",
      benefits: ["Selective data sharing", "Temporary access", "Audit logs", "Data portability"],
    },
    {
      icon: FileText,
      title: "Health Records",
      description: "Comprehensive digital health records that travel with your pet to any provider",
      benefits: ["Portable records", "Provider access", "History tracking", "Emergency information"],
    },
    {
      icon: Users,
      title: "Family Sharing",
      description: "Share pet care responsibilities with family members and trusted caregivers",
      benefits: ["Multi-user access", "Role permissions", "Activity tracking", "Emergency contacts"],
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description: "Rate and review service providers to help other pet owners make informed decisions",
      benefits: ["Honest feedback", "Photo reviews", "Service ratings", "Community trust"],
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Pay for services securely through the platform with automatic receipts and expense tracking",
      benefits: ["Multiple payment methods", "Automatic receipts", "Expense tracking", "Refund protection"],
    },
    {
      icon: Search,
      title: "Lost Pet Network",
      description: "Access community-driven lost and found network with geo-location alerts",
      benefits: ["Instant alerts", "Community support", "Photo matching", "Reunion assistance"],
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <Badge variant="secondary" className="mb-2">
          For Pet Owners
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Everything You Need for Your Pet</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive pet management tools that help you provide the best care for your furry family members
        </p>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Journey */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Your Pet Care Journey</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-medium">Create Pet Profile</h3>
            <p className="text-sm text-muted-foreground">Add your pet's details, photos, and medical history</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="font-medium">Find Services</h3>
            <p className="text-sm text-muted-foreground">Discover trusted vets, groomers, and trainers nearby</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-medium">Book & Connect</h3>
            <p className="text-sm text-muted-foreground">Schedule appointments and communicate with providers</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 className="font-medium">Track & Manage</h3>
            <p className="text-sm text-muted-foreground">Monitor health, get reminders, and build care history</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of pet owners who trust FluffyPet to help them provide the best care for their pets
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Create Free Account</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/features">View All Features</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
