"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, Bookmark, Calendar } from "lucide-react"
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
    joinedDate: string
  }
  createdAt: string
  tags: string[]
  likes: number
  comments: number
  image?: string
}

interface Comment {
  id: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  createdAt: string
  likes: number
}

interface PostDetailProps {
  post: Post
  comments: Comment[]
}

export function PostDetail({ post, comments }: PostDetailProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      {/* Main Post */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>
                  {post.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{post.author.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{post.author.role}</span>
                  <span>•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {new Date(post.author.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="prose max-w-none">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {post.image && (
            <div className="relative h-96 rounded-lg overflow-hidden">
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
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(!liked)}
                className={liked ? "text-red-600" : ""}
              >
                <Heart className={`w-4 h-4 mr-1 ${liked ? "fill-current" : ""}`} />
                {post.likes + (liked ? 1 : 0)}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => setShowCommentForm(!showCommentForm)}>
                <MessageCircle className="w-4 h-4 mr-1" />
                {post.comments}
              </Button>

              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setSaved(!saved)} className={saved ? "text-blue-600" : ""}>
              <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Comment Form */}
      {showCommentForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Add a Comment</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts or advice..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center gap-2">
                <Button disabled={!newComment.trim()}>Post Comment</Button>
                <Button variant="outline" onClick={() => setShowCommentForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>

        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                  <AvatarFallback>
                    {comment.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{comment.author.name}</h4>
                    <span className="text-sm text-gray-500">{comment.author.role}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">{formatTimeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{comment.content}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-3 h-3 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}
