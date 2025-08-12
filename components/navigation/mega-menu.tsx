"use client"
import Link from "next/link"
import {
  PawPrint,
  Calendar,
  Users,
  Shield,
  Heart,
  Star,
  Search,
  AlertTriangle,
  ShoppingBag,
  BookOpen,
  HelpCircle,
  Building2,
  TreePine,
} from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const services = [
  {
    title: "Find Veterinarians",
    href: "/vets",
    description: "Trusted veterinary clinics near you",
    icon: Shield,
  },
  {
    title: "Service Providers",
    href: "/providers",
    description: "Groomers, trainers, and pet sitters",
    icon: Users,
  },
  {
    title: "NGOs & Shelters",
    href: "/ngos",
    description: "Animal rescue organizations",
    icon: TreePine,
  },
  {
    title: "Pet Events",
    href: "/events",
    description: "Adoption drives and workshops",
    icon: Calendar,
  },
]

const features = [
  {
    title: "Discover",
    href: "/discover",
    description: "Find all pet services in one place",
    icon: Search,
  },
  {
    title: "Lost & Found",
    href: "/lost-found",
    description: "Help reunite pets with families",
    icon: AlertTriangle,
  },
  {
    title: "Adoption",
    href: "/adopt",
    description: "Find your perfect companion",
    icon: Heart,
  },
  {
    title: "Pet Shop",
    href: "/shop",
    description: "Quality products for your pets",
    icon: ShoppingBag,
  },
]

const community = [
  {
    title: "Community Hub",
    href: "/community",
    description: "Connect with pet parents",
    icon: Users,
  },
  {
    title: "SOS Emergency",
    href: "/sos",
    description: "Emergency help for animals",
    icon: AlertTriangle,
  },
  {
    title: "Rescue Cases",
    href: "/rescues",
    description: "Active animal rescue efforts",
    icon: Shield,
  },
]

const company = [
  {
    title: "How It Works",
    href: "/how-it-works",
    description: "Learn about our platform",
    icon: BookOpen,
  },
  {
    title: "Our Story",
    href: "/our-story",
    description: "The story behind FluffyPet",
    icon: Heart,
  },
  {
    title: "Pricing",
    href: "/pricing",
    description: "Plans and pricing information",
    icon: Star,
  },
  {
    title: "Help Center",
    href: "/help",
    description: "Get support and answers",
    icon: HelpCircle,
  },
]

export default function MegaMenu() {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="flex items-center space-x-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium hover:text-primary transition-colors">
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[700px] gap-3 p-6 md:grid-cols-2">
              <div className="row-span-4">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/10 to-primary/5 p-6 no-underline outline-none focus:shadow-md border"
                    href="/discover"
                  >
                    <Search className="h-6 w-6 text-primary" />
                    <div className="mb-2 mt-4 text-lg font-medium">Discover All Services</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Find veterinarians, groomers, trainers, and more in your area
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              {services.map((service) => (
                <NavigationMenuLink key={service.href} asChild>
                  <Link
                    href={service.href}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <service.icon className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium leading-none">{service.title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{service.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[700px] gap-3 p-6 md:grid-cols-2">
              <div className="row-span-4">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500/10 to-blue-500/5 p-6 no-underline outline-none focus:shadow-md border"
                    href="/dashboard"
                  >
                    <PawPrint className="h-6 w-6 text-blue-600" />
                    <div className="mb-2 mt-4 text-lg font-medium">Pet Dashboard</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Manage your pets, bookings, and connect with providers
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              {features.map((feature) => (
                <NavigationMenuLink key={feature.href} asChild>
                  <Link
                    href={feature.href}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <feature.icon className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium leading-none">{feature.title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{feature.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium hover:text-primary transition-colors">
            Community
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] gap-3 p-6 md:grid-cols-1">
              <div className="mb-4">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-r from-green-500/10 to-emerald-500/5 p-6 no-underline outline-none focus:shadow-md border"
                    href="/community"
                  >
                    <Users className="h-6 w-6 text-green-600" />
                    <div className="mb-2 mt-4 text-lg font-medium">Join Our Community</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Connect with pet parents, share experiences, and help animals in need
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              {community.map((item) => (
                <NavigationMenuLink key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium hover:text-primary transition-colors">
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] gap-3 p-6 md:grid-cols-1">
              <div className="mb-4">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex w-full select-none flex-col justify-end rounded-md bg-gradient-to-r from-purple-500/10 to-pink-500/5 p-6 no-underline outline-none focus:shadow-md border"
                    href="/about"
                  >
                    <Building2 className="h-6 w-6 text-purple-600" />
                    <div className="mb-2 mt-4 text-lg font-medium">About FluffyPet</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Learn about our mission to improve pet care through technology
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              {company.map((item) => (
                <NavigationMenuLink key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-primary" />
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
