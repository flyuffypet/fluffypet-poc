import { CommunityFeed } from "@/components/community/community-feed"
import { CommunityHeader } from "@/components/community/community-header"

export const dynamic = "force-dynamic"

export default async function CommunityPage() {
  // Mock data for now - in real app this would come from database
  const posts = [
    {
      id: "1",
      title: "Tips for first-time dog owners",
      content:
        "Just adopted my first puppy and looking for advice on training and care. What are the most important things to focus on in the first few weeks?",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Pet Owner",
      },
      createdAt: "2024-01-15T10:30:00Z",
      tags: ["dogs", "training", "advice"],
      likes: 24,
      comments: 8,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "2",
      title: "Success story: Luna found her forever home!",
      content:
        "After 6 months in our shelter, Luna has finally been adopted by a wonderful family. Thank you to everyone who shared her story!",
      author: {
        name: "Happy Paws Rescue",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "NGO",
      },
      createdAt: "2024-01-14T15:45:00Z",
      tags: ["adoption", "success-story", "cats"],
      likes: 156,
      comments: 23,
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: "3",
      title: "DIY pet grooming tips for busy owners",
      content:
        "As a professional groomer, I often get asked about at-home grooming. Here are my top 5 tips for keeping your pet clean and healthy between professional sessions.",
      author: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Professional Groomer",
      },
      createdAt: "2024-01-13T09:15:00Z",
      tags: ["grooming", "diy", "tips"],
      likes: 89,
      comments: 15,
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const trendingTags = [
    { name: "adoption", count: 45 },
    { name: "training", count: 32 },
    { name: "health", count: 28 },
    { name: "grooming", count: 24 },
    { name: "rescue", count: 19 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <CommunityHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            <CommunityFeed posts={posts} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Tags */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-2">
                {trendingTags.map((tag) => (
                  <a
                    key={tag.name}
                    href={`/community/tags/${tag.name}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-blue-600 hover:underline">#{tag.name}</span>
                    <span className="text-sm text-gray-500">{tag.count} posts</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Community Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Be respectful and kind to all members</li>
                <li>• Share helpful and accurate information</li>
                <li>• No spam or promotional content</li>
                <li>• Keep posts relevant to pet care</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: "Community - FluffyPet",
  description:
    "Connect with pet owners, professionals, and animal lovers. Share experiences, get advice, and build relationships in our pet care community.",
}
