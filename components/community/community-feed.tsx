"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  tags: string[]
  likes: number
  comments: number
  image?: string
}

interface CommunityFeedProps {
  posts: Post[]
}

export function CommunityFeed({ posts }: CommunityFeedProps) {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleSave = (postId: string) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

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
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
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
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Link href={`/community/post/${post.id}`}>
                <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">{post.title}</h3>
              </Link>
              <p className="text-gray-700 line-clamp-3">{post.content}</p>
            </div>

            {post.image && (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link key={tag} href={`/community/tags/${tag}`}>
                  <Badge variant="secondary" className="hover:bg-blue-100 hover:text-blue-800 transition-colors">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className={likedPosts.has(post.id) ? "text-red-600" : ""}
                >
                  <Heart className={`w-4 h-4 mr-1 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSave(post.id)}
                className={savedPosts.has(post.id) ? "text-blue-600" : ""}
              >
                <Bookmark className={`w-4 h-4 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Load More */}
      <div className="text-center py-8">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>
    </div>
  )
}
