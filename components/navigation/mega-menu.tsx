"use client"
import Link from "next/link"
import { PawPrint, Calendar, MessageCircle, Users, Shield, Heart, MapPin, Star } from "lucide-react"
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
    title: "Pet Sitting",
    href: "/services/pet-sitting",
    description: "Professional pet sitting in your home",
    icon: Heart,
  },
  {
    title: "Dog Walking",
    href: "/services/dog-walking",
    description: "Daily walks and exercise for your dog",
    icon: MapPin,
  },
  {
    title: "Veterinary Care",
    href: "/services/veterinary",
    description: "Medical care and health checkups",
    icon: Shield,
  },
  {
    title: "Pet Grooming",
    href: "/services/grooming",
    description: "Professional grooming services",
    icon: Star,
  },
]

const features = [
  {
    title: "My Pets",
    href: "/pets",
    description: "Manage your pet profiles",
    icon: PawPrint,
  },
  {
    title: "Bookings",
    href: "/bookings",
    description: "View and manage appointments",
    icon: Calendar,
  },
  {
    title: "Messages",
    href: "/messages",
    description: "Chat with service providers",
    icon: MessageCircle,
  },
  {
    title: "Providers",
    href: "/providers",
    description: "Find trusted pet care providers",
    icon: Users,
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
            <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/services"
                  >
                    <Heart className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">All Services</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Discover all our pet care services in one place
                    </p>
                  </Link>
                </NavigationMenuLink>
              </div>
              {services.slice(0, 3).map((service) => (
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
            <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
              <div className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/dashboard"
                  >
                    <PawPrint className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">Dashboard</div>
                    <p className="text-sm leading-tight text-muted-foreground">Your complete pet care management hub</p>
                  </Link>
                </NavigationMenuLink>
              </div>
              {features.slice(0, 3).map((feature) => (
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
          <NavigationMenuLink asChild>
            <Link
              href="/about"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/contact"
              className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              Contact
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
