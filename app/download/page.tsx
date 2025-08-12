import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Download, Star, Shield, Zap } from "lucide-react"

export default function DownloadPage() {
  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book veterinary appointments and services with just a few taps",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your pet's medical data is encrypted and securely stored",
    },
    {
      icon: Star,
      title: "Trusted Providers",
      description: "Connect with verified veterinarians and service providers",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Download FluffyPet</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take pet care with you wherever you go. Book appointments, chat with providers, and manage your pet's health
            from your mobile device.
          </p>
        </div>

        {/* App Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Everything you need for pet care</h2>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-semibold mb-2">FluffyPet Mobile</h3>
              <p className="text-blue-100">Pet care at your fingertips</p>
            </div>
          </div>
        </div>

        {/* Download Links */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-6">Download Now</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">App Store</h3>
                <p className="text-sm text-gray-600">Download for iOS</p>
                <Badge variant="outline" className="mt-2">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">Google Play</h3>
                <p className="text-sm text-gray-600">Download for Android</p>
                <Badge variant="outline" className="mt-2">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-gray-600">Happy Pet Owners</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600">Verified Providers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">App Store Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Web App Alternative */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Use FluffyPet on the Web</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            While our mobile apps are in development, you can access all FluffyPet features through our web platform.
            Get started today!
          </p>
          <Button asChild size="lg">
            <a href="/">Open Web App</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Download FluffyPet Mobile App - Pet Care On The Go",
  description:
    "Download the FluffyPet mobile app for iOS and Android. Book veterinary appointments, chat with providers, and manage your pet's health from anywhere.",
}
