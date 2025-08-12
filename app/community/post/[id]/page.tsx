import { PostDetail } from "@/components/community/post-detail"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PostPageProps {
  params: { id: string }
}

export default async function PostPage({ params }: PostPageProps) {
  // Mock data - in real app this would come from database
  const post = {
    id: params.id,
    title: "Tips for first-time dog owners",
    content: `Just adopted my first puppy and looking for advice on training and care. What are the most important things to focus on in the first few weeks?

I've been reading a lot online but there's so much conflicting information. Would love to hear from experienced dog owners about what really matters in those crucial early days.

Some specific questions:
- How often should I be taking my puppy out for potty training?
- What's the best approach to crate training?
- How do I know if my puppy is getting enough exercise?
- Any recommendations for puppy-safe toys?

Thanks in advance for any advice!`,
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Pet Owner",
      joinedDate: "2023-08-15",
    },
    createdAt: "2024-01-15T10:30:00Z",
    tags: ["dogs", "training", "advice"],
    likes: 24,
    comments: 8,
    image: "/placeholder.svg?height=400&width=600",
  }

  const comments = [
    {
      id: "1",
      content:
        "Great questions! For potty training, I recommend taking your puppy out every 2-3 hours, especially after meals and naps. Consistency is key!",
      author: {
        name: "Mike Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Professional Trainer",
      },
      createdAt: "2024-01-15T11:15:00Z",
      likes: 12,
    },
    {
      id: "2",
      content:
        "Crate training was a game-changer for us. Start with short periods and gradually increase. Make sure the crate is comfortable with blankets and toys.",
      author: {
        name: "Emma Davis",
        avatar: "/placeholder.svg?height=32&width=32",
        role: "Pet Owner",
      },
      createdAt: "2024-01-15T12:30:00Z",
      likes: 8,
    },
  ]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/community">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Link>
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostDetail post={post} comments={comments} />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PostPageProps) {
  // In real app, fetch post data here
  return {
    title: "Tips for first-time dog owners - Community | FluffyPet",
    description: "Community discussion about dog training and care advice for new pet owners.",
  }
}
