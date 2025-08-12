import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Check, X, Star, Users, Building, Crown } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Pet Owner",
      price: "Free",
      period: "forever",
      description: "Perfect for individual pet owners",
      icon: Star,
      features: [
        "Up to 3 pet profiles",
        "Basic health records",
        "Appointment booking",
        "Direct messaging",
        "Photo storage (1GB)",
        "Community access",
        "Lost & found alerts",
      ],
      limitations: ["Limited to 3 pets", "Basic support only", "Standard features only"],
      cta: "Get Started Free",
      href: "/signup",
      popular: false,
    },
    {
      name: "Pet Family",
      price: "$9.99",
      period: "per month",
      description: "For families with multiple pets",
      icon: Users,
      features: [
        "Unlimited pet profiles",
        "Advanced health tracking",
        "Priority booking",
        "Family sharing",
        "Photo storage (10GB)",
        "Smart reminders",
        "Expense tracking",
        "Premium support",
      ],
      limitations: [],
      cta: "Start Free Trial",
      href: "/signup?plan=family",
      popular: true,
    },
    {
      name: "Professional",
      price: "$49.99",
      period: "per month",
      description: "For vets, groomers, trainers",
      icon: Building,
      features: [
        "Professional profile",
        "Appointment management",
        "Client communication",
        "Payment processing",
        "Business analytics",
        "Team collaboration",
        "Custom branding",
        "API access",
      ],
      limitations: [],
      cta: "Start Free Trial",
      href: "/signup?plan=professional",
      popular: false,
    },
    {
      name: "Organization",
      price: "$199.99",
      period: "per month",
      description: "For clinics, NGOs, enterprises",
      icon: Crown,
      features: [
        "Multi-location support",
        "Advanced user management",
        "Custom workflows",
        "White-label options",
        "Advanced analytics",
        "Priority support",
        "Custom integrations",
        "Dedicated account manager",
      ],
      limitations: [],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
    },
  ]

  const faqs = [
    {
      question: "Is there really a free plan?",
      answer:
        "Yes! Our Pet Owner plan is completely free forever. You can manage up to 3 pets with all basic features included.",
    },
    {
      question: "What are marketplace fees?",
      answer:
        "We charge a small transaction fee (2.9% + $0.30) when you book paid services through our platform. This helps us maintain the platform and support our service providers.",
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer:
        "You can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the end of your current billing cycle.",
    },
    {
      question: "Do you offer discounts for NGOs?",
      answer:
        "Yes! We offer special pricing for registered non-profit organizations and animal rescue groups. Contact our sales team for details.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.",
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees ever! All plans include free onboarding and setup assistance.",
    },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl p-4 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose the plan that's right for you. Start free and upgrade as you grow.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative h-full ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Most Popular</Badge>
              )}
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <plan.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.limitations.map((limitation, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                      {limitation}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Marketplace Fees */}
      <section className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Marketplace Fees</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Simple, transparent fees for booking services through our platform
          </p>
        </div>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">For Pet Owners</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Free to browse and contact providers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">2.9% + $0.30 per transaction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Secure payment processing included</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">For Service Providers</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Keep 97.1% of every transaction</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Automatic payouts every 2 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm">No monthly minimums or hidden fees</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-semibold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about our pricing</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <h2 className="text-2xl font-semibold">Ready to Get Started?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of pet owners and professionals who trust FluffyPet for their pet care needs
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Start Free Today</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
