"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  createdAt: string
  likes: number
  comments: number
}

interface TagFeedProps {
  posts: Post[]
  tag: string
}

export function TagFeed({ posts, tag }: TagFeedProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Posts tagged #{tag}</h2>
        <Button asChild>
          <Link href={`/community/new-post?tag=${tag}`}>Create Post</Link>
        </Button>
      </div>

      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{post.author.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.author.role}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Link href={`/community/post/${post.id}`}>
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">{post.title}</h3>
              </Link>
              <p className="text-gray-700">{post.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t">
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4 mr-1" />
                {post.likes}
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link href={`/community/post/${post.id}`}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments}
                </Link>
              </Button>

              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No posts found for #{tag}</p>
          <Button asChild>
            <Link href={`/community/new-post?tag=${tag}`}>Be the first to post about #{tag}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
