import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Clock, Users, Heart, Code, Briefcase, Stethoscope, Megaphone } from "lucide-react"

export default function CareersPage() {
  const openRoles = [
    {
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      icon: Code,
      description: "Build scalable pet care solutions using Next.js, TypeScript, and Supabase",
      requirements: ["5+ years full-stack experience", "React/Next.js expertise", "Database design skills"],
    },
    {
      title: "Veterinary Relations Manager",
      department: "Partnerships",
      location: "Remote",
      type: "Full-time",
      icon: Stethoscope,
      description: "Build relationships with veterinary clinics and ensure platform meets their needs",
      requirements: ["Veterinary background preferred", "Partnership experience", "Excellent communication"],
    },
    {
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      icon: Megaphone,
      description: "Drive product adoption and create compelling messaging for pet care professionals",
      requirements: ["B2B SaaS marketing experience", "Content creation skills", "Data-driven approach"],
    },
    {
      title: "Customer Success Specialist",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      icon: Users,
      description: "Help pet owners and professionals get the most value from our platform",
      requirements: ["Customer service experience", "Pet industry knowledge helpful", "Problem-solving skills"],
    },
    {
      title: "Business Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      icon: Briefcase,
      description: "Generate leads and build relationships with veterinary clinics and service providers",
      requirements: ["Sales experience", "CRM proficiency", "Self-motivated"],
    },
  ]

  const benefits = [
    {
      title: "Health & Wellness",
      items: ["Comprehensive health insurance", "Mental health support", "Wellness stipend", "Pet insurance coverage"],
    },
    {
      title: "Work-Life Balance",
      items: ["Flexible working hours", "Remote-first culture", "Unlimited PTO", "Sabbatical program"],
    },
    {
      title: "Growth & Development",
      items: ["Learning & development budget", "Conference attendance", "Mentorship programs", "Career advancement"],
    },
    {
      title: "Financial Benefits",
      items: ["Competitive salary", "Equity participation", "401(k) matching", "Performance bonuses"],
    },
  ]

  const values = [
    {
      icon: Heart,
      title: "Pet-First Mindset",
      description: "Every decision we make considers the impact on pet health and wellbeing",
    },
    {
      icon: Users,
      title: "Collaborative Spirit",
      description: "We work together across teams to solve complex problems and support each other",
    },
    {
      icon: Code,
      title: "Innovation Focus",
      description: "We embrace new technologies and approaches to improve pet care outcomes",
    },
    {
      icon: Briefcase,
      title: "Professional Growth",
      description: "We invest in our team's development and provide opportunities to advance careers",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Join Our Mission</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Help us build the future of pet care. We're looking for passionate people who want to make a difference in the
          lives of pets and their families.
        </p>
      </section>

      {/* Company Values */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Our Values</h2>
          <p className="text-muted-foreground">What drives us every day</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Open Positions</h2>
          <p className="text-muted-foreground">Join our growing team</p>
        </div>
        <div className="space-y-4">
          {openRoles.map((role, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <role.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary">{role.department}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {role.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {role.type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button asChild>
                    <Link href={`/contact?subject=Application: ${role.title}`}>Apply Now</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{role.description}</p>
                <div>
                  <h4 className="font-medium mb-2">Key Requirements:</h4>
                  <ul className="space-y-1">
                    {role.requirements.map((req, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Benefits & Perks</h2>
          <p className="text-muted-foreground">We take care of our team</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Application Process */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Our Hiring Process</h2>
          <p className="text-muted-foreground">What to expect when you apply</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-medium">Application Review</h3>
            <p className="text-sm text-muted-foreground">We review your application and resume within 3-5 days</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="font-medium">Initial Interview</h3>
            <p className="text-sm text-muted-foreground">30-minute call with our hiring team to discuss the role</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-medium">Technical/Skills Assessment</h3>
            <p className="text-sm text-muted-foreground">Role-specific evaluation of your skills and experience</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-orange-600">4</span>
            </div>
            <h3 className="font-medium">Final Interview</h3>
            <p className="text-sm text-muted-foreground">Meet the team and discuss culture fit and next steps</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold">Don't See Your Role?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're always looking for talented people who share our passion for improving pet care. Send us your resume and
          tell us how you'd like to contribute.
        </p>
        <Button asChild size="lg">
          <Link href="/contact?subject=General Application">Get In Touch</Link>
        </Button>
      </section>
    </div>
  )
}
