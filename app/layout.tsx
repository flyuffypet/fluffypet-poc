import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import ProvidersClient from "@/components/providers-client"
import { Suspense } from "react"
import ErrorBoundary from "@/components/error-boundary"

export const metadata: Metadata = {
  title: "FluffyPet",
  description: "FluffyPet – Secure, multi-tenant pet care platform",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mobile-first app shell with fixed header and sticky bottom nav
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ProvidersClient>
            <ErrorBoundary>
              <Suspense fallback={null}>
                <div className="flex min-h-screen flex-col">
                  <AppHeader />
                  <main className="flex-1 pt-16 pb-20">{children}</main>
                  <MobileNav />
                </div>
              </Suspense>
            </ErrorBoundary>
          </ProvidersClient>
        </ThemeProvider>
        {/* Vercel Analytics & Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
