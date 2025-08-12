import { TagFeed } from "@/components/community/tag-feed"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Hash } from "lucide-react"
import Link from "next/link"

interface TagPageProps {
  params: { slug: string }
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = params.slug

  // Mock data - in real app this would come from database
  const tagInfo = {
    name: tag,
    description: `Posts and discussions about ${tag}`,
    postCount: 45,
    followers: 234,
  }

  const posts = [
    {
      id: "1",
      title: `Best ${tag} practices for beginners`,
      content: `Looking for advice on ${tag}. What are the most important things to know?`,
      author: {
        name: "Pet Owner",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Community Member",
      },
      createdAt: "2024-01-15T10:30:00Z",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      title: `Professional ${tag} tips`,
      content: `As a professional, here are my top recommendations for ${tag}.`,
      author: {
        name: "Expert",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Professional",
      },
      createdAt: "2024-01-14T15:45:00Z",
      likes: 56,
      comments: 12,
    },
  ]

  const relatedTags = ["health", "care", "tips", "advice", "professional"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/community">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Hash className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">#{tagInfo.name}</h1>
              <p className="text-gray-600">{tagInfo.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>{tagInfo.postCount} posts</span>
            <span>{tagInfo.followers} followers</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <TagFeed posts={posts} tag={tag} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Tags */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((relatedTag) => (
                  <Link key={relatedTag} href={`/community/tags/${relatedTag}`}>
                    <Badge variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors">
                      #{relatedTag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Follow Tag */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Follow this tag to get notifications about new posts and discussions.
              </p>
              <Button className="w-full">Follow #{tag}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: TagPageProps) {
  return {
    title: `#${params.slug} - Community | FluffyPet`,
    description: `Explore posts and discussions about ${params.slug} in the FluffyPet community.`,
  }
}
