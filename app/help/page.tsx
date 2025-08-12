import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Shield, Users, Settings } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "New to FluffyPet? Learn the basics",
      articles: [
        { title: "Creating Your Account", slug: "creating-account" },
        { title: "Setting Up Pet Profiles", slug: "pet-profiles" },
        { title: "Finding Service Providers", slug: "finding-providers" },
        { title: "Booking Your First Service", slug: "first-booking" },
      ],
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      description: "Keep your data safe and secure",
      articles: [
        { title: "Privacy Settings", slug: "privacy-settings" },
        { title: "Data Protection", slug: "data-protection" },
        { title: "Account Security", slug: "account-security" },
        { title: "Sharing Pet Information", slug: "sharing-pet-info" },
      ],
    },
    {
      icon: MessageCircle,
      title: "Bookings & Communication",
      description: "Managing appointments and messages",
      articles: [
        { title: "How Booking Works", slug: "booking-process" },
        { title: "Canceling Appointments", slug: "canceling-appointments" },
        { title: "Real-time Chat", slug: "chat-features" },
        { title: "Emergency Contacts", slug: "emergency-contacts" },
      ],
    },
    {
      icon: Settings,
      title: "Account Management",
      description: "Managing your FluffyPet account",
      articles: [
        { title: "Profile Settings", slug: "profile-settings" },
        { title: "Notification Preferences", slug: "notifications" },
        { title: "Payment Methods", slug: "payment-methods" },
        { title: "Subscription Management", slug: "subscriptions" },
      ],
    },
  ]

  const popularArticles = [
    { title: "How to book a veterinary appointment", slug: "book-vet-appointment", category: "Bookings" },
    { title: "Setting up emergency contacts", slug: "emergency-contacts", category: "Safety" },
    { title: "Managing pet medical records", slug: "medical-records", category: "Health" },
    { title: "Finding trusted service providers", slug: "trusted-providers", category: "Discovery" },
    { title: "Understanding pricing and fees", slug: "pricing-fees", category: "Billing" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get the support you need</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input placeholder="Search for help articles..." className="pl-12 py-3 text-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Popular Articles */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularArticles.map((article) => (
              <Card key={article.slug} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                  </div>
                  <Link href={`/help/${article.slug}`} className="hover:text-blue-600">
                    <h3 className="font-medium">{article.title}</h3>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.articles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/help/${article.slug}`}
                        className="block text-sm text-gray-600 hover:text-blue-600 hover:underline"
                      >
                        {article.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with any questions or issues.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/community">Community Forum</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Help Center - FluffyPet",
  description: "Find answers to common questions and get the support you need for FluffyPet.",
}
