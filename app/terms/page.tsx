export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: January 2024</p>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using FluffyPet, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-gray-700">
                FluffyPet is a comprehensive pet care platform that connects pet owners with veterinarians, service
                providers, NGOs, and other pet care professionals. We facilitate bookings, communications, and
                transactions between users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Security</h3>
                  <p className="text-gray-700">
                    You are responsible for maintaining the confidentiality of your account credentials and for all
                    activities that occur under your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Accurate Information</h3>
                  <p className="text-gray-700">
                    You agree to provide accurate, current, and complete information about yourself and your pets when
                    using our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Prohibited Activities</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Violating any applicable laws or regulations</li>
                    <li>Impersonating another person or entity</li>
                    <li>Transmitting harmful or malicious content</li>
                    <li>Interfering with the platform's operation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Service Provider Responsibilities</h2>
              <p className="text-gray-700 mb-4">Service providers using our platform agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Maintain appropriate licenses and certifications</li>
                <li>Provide services in a professional and ethical manner</li>
                <li>Respect client confidentiality and privacy</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
              <p className="text-gray-700">
                Payment processing is handled through secure third-party providers. FluffyPet may charge platform fees
                for certain services. All fees are clearly disclosed before transactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700">
                FluffyPet acts as a platform connecting users and service providers. We are not responsible for the
                quality of services provided by third parties or for any disputes between users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend accounts that violate these terms or engage in harmful
                activities. Users may terminate their accounts at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact us at legal@fluffypet.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Terms of Service - FluffyPet",
  description: "Read the terms and conditions for using FluffyPet platform.",
}
