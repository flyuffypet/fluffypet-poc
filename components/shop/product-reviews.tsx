"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface ProductReviewsProps {
  reviews: any[]
  productId: string
}

export function ProductReviews({ reviews, productId }: ProductReviewsProps) {
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async () => {
    if (!newReview.trim() || newRating === 0) {
      toast.error("Please provide both rating and review")
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        toast.error("Please sign in to write a review")
        return
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        reviewer_id: user.id,
        rating: newRating,
        comment: newReview.trim(),
      })

      if (error) throw error

      toast.success("Review submitted successfully!")
      setNewReview("")
      setNewRating(0)
      // In a real app, you'd refresh the reviews here
    } catch (error) {
      console.error("Review submission error:", error)
      toast.error("Failed to submit review")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Write Review */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setNewRating(star)} className="p-1">
                  <Star
                    className={`w-6 h-6 ${
                      star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitReview} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No reviews yet. Be the first to review this product!
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.profiles?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.profiles?.first_name?.[0]}
                      {review.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {review.profiles?.first_name} {review.profiles?.last_name}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>

                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
