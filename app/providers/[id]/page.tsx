import { createServerClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, Clock, Phone, Mail } from "lucide-react"
import ChatWidget from "@/components/chat/chat-widget"
import { getCurrentUser } from "@/lib/auth"

interface ProviderPageProps {
  params: {
    id: string
  }
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const supabase = createServerClient()
  const currentUser = await getCurrentUser()

  // Fetch provider details
  const { data: provider, error } = await supabase
    .from("profiles")
    .select(`
      id,
      first_name,
      last_name,
      avatar_url,
      bio,
      phone,
      email,
      location,
      role,
      created_at,
      organization_memberships!inner(
        organization:organizations(
          id,
          name,
          type,
          description,
          location,
          contact_email,
          contact_phone
        )
      )
    `)
    .eq("id", params.id)
    .eq("role", "provider")
    .single()

  if (error || !provider) {
    notFound()
  }

  const organization = provider.organization_memberships[0]?.organization

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Provider Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={provider.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {`${provider.first_name?.[0] || ""}${provider.last_name?.[0] || ""}`.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {provider.first_name} {provider.last_name}
                    </h1>
                    <Badge variant="secondary" className="mb-2">
                      Service Provider
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Star className="h-4 w-4 fill-gray-200 text-gray-200" />
                      <span className="ml-2 text-sm text-muted-foreground">4.0 (12 reviews)</span>
                    </div>
                  </div>
                </div>

                {provider.bio && <p className="text-muted-foreground mb-4">{provider.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {provider.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location}</span>
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{provider.phone}</span>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{provider.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Info */}
        {organization && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{organization.name}</h3>
                  <Badge variant="outline" className="mb-2">
                    {organization.type}
                  </Badge>
                  {organization.description && <p className="text-muted-foreground mb-4">{organization.description}</p>}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {organization.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{organization.location}</span>
                      </div>
                    )}
                    {organization.contact_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{organization.contact_phone}</span>
                      </div>
                    )}
                    {organization.contact_email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{organization.contact_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services Offered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Pet Grooming</h4>
                <p className="text-sm text-muted-foreground mb-2">Professional grooming services for all pet types</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>1-2 hours</span>
                  <span className="ml-auto font-semibold">$50-80</span>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Pet Walking</h4>
                <p className="text-sm text-muted-foreground mb-2">Daily walks and exercise for your pets</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>30-60 minutes</span>
                  <span className="ml-auto font-semibold">$25-40</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button size="lg" className="flex-1">
            Book Service
          </Button>
          <Button variant="outline" size="lg">
            View Calendar
          </Button>
        </div>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">John Doe</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Excellent service! My dog came back looking amazing and very happy. Will definitely book again.
                </p>
              </div>

              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">Sarah Miller</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <Star className="h-3 w-3 fill-gray-200 text-gray-200" />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Very professional and caring. Great communication throughout the service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Widget - Only show if user is logged in and not viewing their own profile */}
      {currentUser && currentUser.id !== provider.id && (
        <ChatWidget
          otherUserId={provider.id}
          currentUserId={currentUser.id}
          currentUserName={`${currentUser.first_name || ""} ${currentUser.last_name || ""}`.trim() || "You"}
          currentUserAvatar={currentUser.avatar_url}
          otherUserName={`${provider.first_name} ${provider.last_name}`}
        />
      )}
    </div>
  )
}
