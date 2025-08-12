import { ReportDetail } from "@/components/lost-found/report-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ReportPageProps {
  params: { id: string }
}

export default async function ReportPage({ params }: ReportPageProps) {
  // Mock data - in real app this would come from database
  const report = {
    id: params.id,
    type: "lost" as const,
    petName: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    gender: "Male",
    size: "Large",
    color: "Golden",
    location: "Central Park, NYC",
    lastSeen: "2024-01-15T14:30:00Z",
    description: `Buddy is a friendly golden retriever who went missing during our afternoon walk in Central Park. He was wearing a blue collar with his name tag, but the collar may have come off.

He's very social and loves people, so he might approach strangers. Buddy responds to his name and knows basic commands like "sit" and "stay". He has a small scar on his left ear from a childhood accident.

If you see him, please don't chase - just call his name calmly and contact us immediately. We're offering a reward for his safe return.`,
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
    contactInfo: {
      masked: true,
      message: "Contact through FluffyPet secure messaging",
    },
    reporter: {
      name: "Sarah J.",
      joinedDate: "2023-08-15",
      reportsCount: 1,
      successfulReunions: 0,
    },
    reward: "$500",
    microchipped: true,
    specialNeeds: "None",
    lastSeenDetails: "Near the Bethesda Fountain, heading towards the Bow Bridge",
    reportedAt: "2024-01-15T15:00:00Z",
    status: "active",
  }

  if (!report) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/lost-found">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lost & Found
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ReportDetail report={report} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ReportPageProps) {
  // In real app, fetch report data here
  return {
    title: "Buddy - Lost Golden Retriever | FluffyPet",
    description: "Help us find Buddy, a friendly golden retriever who went missing in Central Park, NYC.",
  }
}
