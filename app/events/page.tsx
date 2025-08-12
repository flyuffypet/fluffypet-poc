import { EventsDirectory } from "@/components/events/events-directory"

export const dynamic = "force-dynamic"

export default async function EventsPage() {
  // Mock data for now - in real app this would come from database
  const events = [
    {
      id: "1",
      title: "Weekend Adoption Drive",
      description: "Meet adorable rescue dogs and cats looking for their forever homes",
      date: "2024-01-20",
      time: "10:00 AM - 4:00 PM",
      location: "Central Park Community Center",
      organizer: "Happy Paws Rescue",
      type: "adoption",
      image: "/placeholder.svg?height=200&width=300",
      attendees: 45,
      maxAttendees: 100,
    },
    {
      id: "2",
      title: "Free Vaccination Camp",
      description: "Free vaccinations and health checkups for street animals",
      date: "2024-01-22",
      time: "9:00 AM - 2:00 PM",
      location: "City Veterinary Hospital",
      organizer: "Animal Welfare Society",
      type: "medical",
      image: "/placeholder.svg?height=200&width=300",
      attendees: 23,
      maxAttendees: 50,
    },
    {
      id: "3",
      title: "Pet Training Workshop",
      description: "Learn basic obedience training techniques for your dog",
      date: "2024-01-25",
      time: "2:00 PM - 5:00 PM",
      location: "Dog Training Academy",
      organizer: "Professional Pet Trainers",
      type: "education",
      image: "/placeholder.svg?height=200&width=300",
      attendees: 12,
      maxAttendees: 20,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Pet Care Events</h1>
          <p className="text-gray-600">
            Discover adoption drives, vaccination camps, training workshops, and other pet-related events near you.
          </p>
        </div>
      </div>

      <EventsDirectory events={events} />
    </div>
  )
}

export const metadata = {
  title: "Pet Care Events - FluffyPet",
  description:
    "Discover adoption drives, vaccination camps, training workshops, and other pet-related events near you.",
}
