import type { Metadata } from "next"
import { Heart, Stethoscope, Shield, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Story - FluffyPet",
  description:
    "Learn about FluffyPet's mission to create better systems for pet care, inspired by veterinary practice and built with compassion.",
  keywords: "FluffyPet story, pet care platform, veterinary technology, animal welfare",
}

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 leading-relaxed">
            FluffyPet emerged as an intentional act of gratitude and system design.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none">
          {/* Opening Section */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 m-0">A Tribute to Compassion</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              It is a tribute to my father—a veterinarian whose practice revealed, with empirical clarity, the gap
              between compassion and infrastructure. Years in his clinic made visible a set of persistent market and
              coordination failures: clinical data fragmented across paper files and private phones; limited continuity
              of care; unreliable emergency triage; uneven provider verification; ad‑hoc Lost & Found networks;
              frictions in adoption; and non‑standard pricing and policies that burden both families and professionals.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              Love for animals is abundant; the systems around them are not. FluffyPet translates that observation into
              a durable response.
            </p>
          </div>

          {/* From Clinic to Code */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="flex items-center mb-6">
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 m-0">From clinic bench to codebase</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              I did not begin with software for its own sake. I began with a field inventory of avoidable harm. Through
              structured conversations with pet parents, clinicians, NGOs, shelters, groomers, breeders, and service
              providers, a consistent taxonomy of problems emerged:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Data fragmentation</h4>
                <p className="text-sm text-gray-600">
                  Longitudinal medical histories scattered across devices and messaging threads.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Discontinuity of care</h4>
                <p className="text-sm text-gray-600">Each visit restarting from incomplete context.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Access latency</h4>
                <p className="text-sm text-gray-600">Slow discovery and limited local networks during emergencies.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Trust asymmetry</h4>
                <p className="text-sm text-gray-600">Variable verification of providers and facilities.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Civic coordination gaps</h4>
                <p className="text-sm text-gray-600">Lost & Found efforts without shared maps or alerts.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Policy variability</h4>
                <p className="text-sm text-gray-600">Non‑standard practices that create confusion and inequity.</p>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed font-medium">
              FluffyPet is the resulting platformization of these lessons: a privacy‑preserving, multi‑stakeholder
              system that turns scattered intent into coordinated action.
            </p>
          </div>

          {/* What FluffyPet Does */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 m-0">What FluffyPet does—by design</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Unified, longitudinal records</h4>
                  <p className="text-gray-600">
                    A secure home for each pet's health history, media, and documents, governed by clear consent and
                    role‑based access.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Portable, revocable sharing</h4>
                  <p className="text-gray-600">
                    Context‑specific snapshots for vets or providers that travel with the pet and can be withdrawn
                    instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Real‑time operations</h4>
                  <p className="text-gray-600">
                    Bookings, messaging, and updates that synchronize owners, clinicians, and service teams.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Accountable discovery</h4>
                  <p className="text-gray-600">
                    Verified clinics, vets, NGOs, and providers ranked by proximity, availability, and quality signals.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Civic tooling that matters</h4>
                  <p className="text-gray-600">
                    Lost & Found with geo‑alerts, rescue coordination, adoption pipelines, and useful forums—not noise.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Transparent commerce</h4>
                  <p className="text-gray-600">
                    Clear listings for services and products; reviews anchored to verified interactions; straightforward
                    checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Ethical breeding & matching</h4>
                  <p className="text-gray-600">
                    Optional, consent‑driven introductions with vet verification and owner controls.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                Under the hood, we build privacy‑first, security‑forward, and interoperable systems so the right people
                see the right data at the right time—never more, never less.
              </p>
            </div>
          </div>

          {/* Personal North Star */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">A personal north star</h2>
            <p className="text-gray-700 leading-relaxed">
              I am deeply inspired by the late Ratan Tata—by his insistence that enterprise can be both excellent and
              humane. FluffyPet follows that ethic: do what is right, do it well, and make it accessible.
            </p>
          </div>

          {/* Giving Back */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 m-0">Giving back, by architecture</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              FluffyPet is not only an application; it is public‑interest infrastructure for companion‑animal care. Our
              commitments are formal, not ornamental:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">NGO & shelter enablement</h4>
                <p className="text-sm text-purple-700">
                  Discounted—often free—workflows for intake, foster, and adoption.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Lost & Found access</h4>
                <p className="text-sm text-green-700">
                  Permanently free, prioritized geo‑alerts for rapid reunification.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Vet‑first platform</h4>
                <p className="text-sm text-blue-700">
                  Professional verification, meaningful visibility, and tools that respect clinical time.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Community fund</h4>
                <p className="text-sm text-orange-700">
                  A dedicated share of revenue for partner NGOs and emergency cases, governed transparently.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">User rights by default</h4>
              <p className="text-gray-600">Data export and deletion are product features, not favors.</p>
            </div>
          </div>

          {/* How We Work */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">How we work</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Privacy by design</h4>
                <p className="text-gray-600">
                  Explicit consent scopes, time‑bounded sharing, and revocation that is actually honored.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Verifiability</h4>
                <p className="text-gray-600">
                  Identities and reviews tied to real interactions; no anonymous reputational arbitrage.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">India‑first, globally rigorous</h4>
                <p className="text-gray-600">
                  Built for local realities—language, bandwidth, payments, logistics—while adhering to international
                  best practices.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-1">Human support</h4>
                <p className="text-gray-600">Responsive help, plain‑language policies, and zero dark patterns.</p>
              </div>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 mb-12 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Where we are headed</h2>
            <p className="leading-relaxed">
              We envision an ecosystem in which every pet maintains a portable, trusted identity; every clinician
              receives sufficient context at the point of care; NGOs coordinate with real capacity signals; and families
              act with confidence rather than confusion. City by city, we are laying the rails for a more organized,
              humane, and resilient pet‑care system.
            </p>
          </div>

          {/* Personal Note */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-12 shadow-lg border-l-4 border-amber-400">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">A note to my father</h2>
            <p className="text-gray-700 leading-relaxed italic">
              This work is for you—and for every veterinarian who opens the clinic before dawn and closes it after dusk.
              You taught me that dignity is owed to every living being, and that systems should serve the people who
              serve others. FluffyPet is my attempt to carry that standard forward.
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you are a pet parent, a clinic, a service provider, a shelter, or a volunteer—you have a place
              here. Create your profile, add your pet, and help build the organized, trustworthy, and humane ecosystem
              our communities deserve.
            </p>
            <div className="text-xl font-semibold text-blue-600 mb-4">FluffyPet — built with care, to care.</div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/contact"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
