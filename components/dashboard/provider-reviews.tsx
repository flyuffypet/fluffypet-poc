"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, TrendingUp, MessageCircle, ThumbsUp } from "lucide-react"

export function ProviderReviews() {
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [replyText, setReplyText] = useState("")

  const mockReviews = [
    {
      id: 1,
      client: "Sarah Wilson",
      pet: "Charlie",
      rating: 5,
      date: "2024-01-10",
      service: "Dog Walking",
      comment: "Amazing service! Charlie loves his walks with them. Very professional and reliable.",
      hasReply: false,
      helpful: 12,
    },
    {
      id: 2,
      client: "Mike Chen",
      pet: "Whiskers",
      rating: 4,
      date: "2024-01-08",
      service: "Cat Sitting",
      comment: "Great care for my cat. Would have liked more photo updates during the day.",
      hasReply: true,
      reply: "Thank you for the feedback! I'll make sure to send more updates next time.",
      helpful: 8,
    },
    {
      id: 3,
      client: "Emma Davis",
      pet: "Rocky",
      rating: 5,
      date: "2024-01-05",
      service: "Dog Training",
      comment: "Excellent trainer! Rocky has improved so much in just a few sessions.",
      hasReply: false,
      helpful: 15,
    },
    {
      id: 4,
      client: "John Smith",
      pet: "Luna",
      rating: 3,
      date: "2024-01-03",
      service: "Pet Grooming",
      comment: "Good service but Luna seemed a bit stressed after grooming. Maybe needs more gentle approach.",
      hasReply: false,
      helpful: 5,
    },
  ]

  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: mockReviews.filter((r) => r.rating === rating).length,
    percentage: (mockReviews.filter((r) => r.rating === rating).length / mockReviews.length) * 100,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Star className="h-5 w-5" />
          Reviews & Ratings
        </h2>
        <Badge variant="secondary">{mockReviews.length} Total Reviews</Badge>
      </div>

      {/* Rating Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Overall Rating</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {mockReviews.length} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.rating}★</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-green-600">+0.2</p>
                <p className="text-xs text-muted-foreground">Rating improvement</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">75%</p>
                <p className="text-xs text-muted-foreground">Reviews with replies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Recent Reviews</h3>
          {mockReviews.map((review) => (
            <Card
              key={review.id}
              className={`cursor-pointer transition-colors ${
                selectedReview?.id === review.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedReview(review)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{review.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.pet} • {review.service}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-3">{review.comment}</p>
                {review.hasReply && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Your Reply:</p>
                    <p className="text-sm">{review.reply}</p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="h-3 w-3" />
                    <span className="text-xs text-muted-foreground">{review.helpful} helpful</span>
                  </div>
                  {!review.hasReply && <Badge variant="outline">Needs Reply</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply Panel */}
        <div>
          {selectedReview ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Reply to Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{selectedReview.client}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= selectedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{selectedReview.comment}</p>
                </div>

                {selectedReview.hasReply ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">Your Reply:</p>
                    <p className="text-sm text-green-700">{selectedReview.reply}</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Edit Reply
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Write a professional reply to this review..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <Button className="flex-1">Send Reply</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Save Draft
                      </Button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Reply Tips</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Thank the client for their feedback</li>
                    <li>• Address any specific concerns mentioned</li>
                    <li>• Keep it professional and positive</li>
                    <li>• Invite them to contact you directly if needed</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a review to reply</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
