"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"
import { PawPrint, ShieldCheck, MapPin, MessageSquareText } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative z-10 p-6 md:p-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy-first
          </Badge>
          <span>•</span>
          <span>Multi-tenant</span>
          <span>•</span>
          <span>Real-time</span>
        </div>

        <div className="mt-4 mb-3">
          <Logo width={180} height={60} />
        </div>

        <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
          FluffyPet: secure, real-time care
          <br className="hidden sm:block" />
          for owners, providers, and vets
        </h1>

        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Create immutable pet profiles with medical data, book services with instant updates and chat, and share
          records privately with organizations—powered by Supabase, Vercel Blob, and Google Maps.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/org/new">For providers & orgs</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/pets">View demo</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border bg-background p-3 text-sm">
            <PawPrint className="h-4 w-4 text-primary" />
            Pet profiles + medical
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-background p-3 text-sm">
            <MessageSquareText className="h-4 w-4 text-primary" />
            Booking & real-time chat
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-background p-3 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            Location-aware discovery
          </div>
        </div>

        <div className="mt-8 grid items-center gap-4 md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
            <img
              src="/placeholder.svg?height=720&width=1280"
              alt="FluffyPet dashboard preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
            <img
              src="/placeholder.svg?height=720&width=1280"
              alt="Pet profile & medical cards"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
