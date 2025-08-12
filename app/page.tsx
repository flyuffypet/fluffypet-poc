import Hero from "@/components/landing/hero"
import FeatureGrid from "@/components/landing/feature-grid"
import HowItWorks from "@/components/landing/how-it-works"
import Integrations from "@/components/landing/integrations"
import Security from "@/components/landing/security"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 space-y-8 md:space-y-10">
      <Hero />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Everything you need to deliver trusted pet care</h2>
          <p className="text-sm text-muted-foreground">
            FluffyPet unifies owners, providers, vets, NGOs, breeders, hostels, and volunteers in a single, secure
            platform.
          </p>
        </div>
        <FeatureGrid />
      </section>

      <HowItWorks />

      <Integrations />

      <Security />

      <section className="rounded-xl border bg-card p-6 text-center md:p-10">
        <h2 className="text-2xl font-semibold">Ready to get started?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          Create your account, add your pets, and book your first appointment. Providers can set up an org and invite
          their team.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <Button asChild>
            <Link href="/signup">Create free account</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/org/new">Set up provider org</Link>
          </Button>
        </div>
      </section>

      <footer className="pb-8 pt-2 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FluffyPet. All rights reserved.
      </footer>
    </div>
  )
}
