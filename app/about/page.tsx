import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Heart, Users, Shield, Globe, Stethoscope, Scissors, GraduationCap } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Privacy First",
      description: "You control what you share and for how long - your data, your choice",
    },
    {
      icon: Shield,
      title: "Verification & Accountability",
      description: "We elevate verified clinics, vets, NGOs, and providers with reviews tied to real interactions",
    },
    {
      icon: Globe,
      title: "Local Realities, Global Quality",
      description: "Designed for Indian pet care constraints while meeting international standards",
    },
    {
      icon: Users,
      title: "Giving Back",
      description: "Free access to critical features, supporting NGOs with discounted tools and community outcomes",
    },
  ]

  const services = [
    {
      icon: Stethoscope,
      title: "Vet Consultations",
      description: "Connect with qualified professionals for your pet's health needs",
    },
    {
      icon: Scissors,
      title: "Professional Grooming",
      description: "Grooming services that respect species, coat, and temperament",
    },
    {
      icon: GraduationCap,
      title: "Training & Development",
      description: "Build skills and strengthen bonds with professional training",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">About FluffyPet</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          FluffyPet exists to make pet care organized, humane, and easy—built in India, for the world.
        </p>
      </section>

      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Our Story</h2>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 space-y-6">
          <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
            <p>
              FluffyPet began as a promise I made in a veterinary clinic. My father, a veterinarian, showed me daily how
              compassion can run into broken systems—records scattered across phones, emergencies handled by guesswork,
              trusted professionals hidden behind an unorganized ecosystem. FluffyPet is my response: a privacy-first,
              interoperable platform that turns scattered intent into coordinated care.
            </p>
            <p>
              I'm inspired by the late Ratan Tata's belief that enterprise should be both excellent and humane.
              FluffyPet follows that path: do what is right, do it well, and make it accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">Why FluffyPet</h2>
        <div className="prose prose-lg max-w-4xl mx-auto text-muted-foreground text-center">
          <p>
            Pet parents, vets, NGOs, shelters, service providers, and volunteers all want the same thing: better
            outcomes for animals. What's been missing is shared infrastructure. FluffyPet organizes the
            essentials—profiles, medical records, bookings, discovery, lost-and-found, adoption, community—so the right
            people have the right context at the right time.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">What FluffyPet Is Today</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Comprehensive Pet Care Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                A comprehensive hub for pet care in India. FluffyPet brings key services and discovery into one place so
                families and professionals can act quickly and confidently.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Founded in 2023</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Founded to close the gap between love for animals and the systems that support them.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Clear Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Make trustworthy, quality pet services accessible—from clinical care to everyday needs.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Simple Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Pet care that's hassle-free, transparent, and tailored to each pet.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">What You Can Do on FluffyPet</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">What's Next</h2>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
          <p className="text-lg text-center text-gray-700">
            Crowdfunding for pets in need and a seamless, safe buy-sell experience—delivered with rigorous verification
            and platform transparency.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-center">How We Work</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-center">A Founder's Note</h2>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
          <blockquote className="text-center text-lg italic text-gray-700">
            "This platform is my tribute to my father and to every veterinarian, rescuer, and volunteer who shows up
            before dawn and stays past dusk. You taught me that dignity belongs to every living being—and that systems
            should serve the people who serve others. FluffyPet is my way of carrying that work forward."
          </blockquote>
        </div>
      </section>

      <section className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold">Join Us</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you're a pet parent, clinic, provider, shelter, or volunteer, you have a place here. Create your
          profile, add your pet, and help build an organized, trustworthy, and humane pet ecosystem.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/our-story">Read Our Full Story</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
