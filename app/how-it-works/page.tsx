import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Users, Calendar, MessageCircle, Shield } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">How FluffyPet Works</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive platform connecting pet owners with trusted veterinarians, service providers, NGOs, and more.
        </p>
      </section>

      {/* User Journey Flows */}
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">For Every Pet Care Need</h2>

        {/* Pet Owners Flow */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Pet Owners</Badge>
              <CardTitle>Complete Pet Care Management</CardTitle>
            </div>
            <CardDescription>
              Manage your pet's health, book services, and connect with trusted providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Create Profile</h3>
                <p className="text-sm text-muted-foreground">Add your pets with medical history and photos</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium">Book Services</h3>
                <p className="text-sm text-muted-foreground">Find and book vets, groomers, trainers nearby</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Real-time Chat</h3>
                <p className="text-sm text-muted-foreground">Communicate directly with service providers</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-medium">Secure Records</h3>
                <p className="text-sm text-muted-foreground">All medical data encrypted and private</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Veterinarians Flow */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Veterinarians
              </Badge>
              <CardTitle>Professional Practice Management</CardTitle>
            </div>
            <CardDescription>Streamline appointments, access patient records, and grow your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Patient Management</h3>
                <p className="text-sm text-muted-foreground">Access shared pet medical records with owner permission</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Appointment Booking</h3>
                <p className="text-sm text-muted-foreground">Automated scheduling with real-time availability</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Secure Communication</h3>
                <p className="text-sm text-muted-foreground">HIPAA-compliant messaging with pet owners</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NGOs Flow */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                NGOs & Rescues
              </Badge>
              <CardTitle>Rescue & Adoption Platform</CardTitle>
            </div>
            <CardDescription>Manage rescue operations, facilitate adoptions, and coordinate volunteers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Rescue Management</h3>
                <p className="text-sm text-muted-foreground">Track rescue cases and coordinate care</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Adoption Listings</h3>
                <p className="text-sm text-muted-foreground">Showcase adoptable pets with detailed profiles</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Volunteer Network</h3>
                <p className="text-sm text-muted-foreground">Organize volunteers and track contributions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Providers Flow */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Service Providers
              </Badge>
              <CardTitle>Professional Services Hub</CardTitle>
            </div>
            <CardDescription>Groomers, trainers, walkers, and boarding facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium">Service Listings</h3>
                <p className="text-sm text-muted-foreground">Showcase your services with pricing and availability</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Client Management</h3>
                <p className="text-sm text-muted-foreground">Access pet profiles and service history</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Payment Processing</h3>
                <p className="text-sm text-muted-foreground">Secure payments and automated invoicing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold">Ready to Join FluffyPet?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you're a pet owner, veterinarian, NGO, or service provider, FluffyPet has the tools you need.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
