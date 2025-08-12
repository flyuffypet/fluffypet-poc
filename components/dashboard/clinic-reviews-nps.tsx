"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, TrendingUp } from "lucide-react"

export function ClinicReviewsNPS() {
  const [activeTab, setActiveTab] = useState("reviews")

  const mockReviews = [
    {
      id: 1,
      customerName: "Sarah Wilson",
      petName: "Buddy",
      rating: 5,
      comment: "Excellent care for my dog. Dr. Smith was very thorough and caring.",
      date: "2024-01-15",
      status: "published",
      service: "Routine Checkup",
      response: null,
    },
    {
      id: 2,
      customerName: "Mike Chen",
      petName: "Luna",
      rating: 4,
      comment: "Good service but had to wait longer than expected.",
      date: "2024-01-14",
      status: "pending_response",
      service: "Vaccination",
      response: null,
    },
    {
      id: 3,
      customerName: "Emma Davis",
      petName: "Max",
      rating: 2,
      comment: "Not satisfied with the communication during the procedure.",
      date: "2024-01-12",
      status: "flagged",
      service: "Surgery",
      response: null,
    },
  ]

  const mockNPSData = {
    score: 72,
    promoters: 65,
    passives: 25,
    detractors: 10,
    totalResponses: 150,
    trend: "+5",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "default"
      case "pending_response":
        return "secondary"
      case "flagged":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Star className="h-5 w-5" />
          Reviews & NPS
        </h2>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockNPSData.score}</div>
            <p className="text-xs text-green-600">{mockNPSData.trend} from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Responses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockReviews.filter((r) => r.status === "pending_response").length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {mockReviews.filter((r) => r.status === "flagged").length}
            </div>
            <p className="text-xs text-muted-foreground">Require action</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">Review Moderation</TabsTrigger>
          <TabsTrigger value="nps">NPS Dashboard</TabsTrigger>
          <TabsTrigger value="trends">Rating Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">
                          {review.customerName} - {review.petName}
                        </h4>
                        <p className="text-sm text-muted-foreground">{review.service}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                            {review.rating}/5
                          </span>
                          <Badge variant={getStatusColor(review.status)}>{review.status.replace("_", " ")}</Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm mb-3">{review.comment}</p>

                    {review.status === "pending_response" && (
                      <div className="space-y-3 border-t pt-3">
                        <Textarea placeholder="Write your response..." className="min-h-[80px]" />
                        <div className="flex gap-2">
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="outline" size="sm">
                            Mark as Resolved
                          </Button>
                        </div>
                      </div>
                    )}

                    {review.status === "flagged" && (
                      <div className="flex gap-2 border-t pt-3">
                        <Button size="sm" variant="destructive">
                          Remove Review
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Customer
                        </Button>
                        <Button size="sm" variant="outline">
                          Escalate
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Promoters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{mockNPSData.promoters}%</div>
                <p className="text-xs text-muted-foreground">Score 9-10</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Passives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{mockNPSData.passives}%</div>
                <p className="text-xs text-muted-foreground">Score 7-8</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detractors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{mockNPSData.detractors}%</div>
                <p className="text-xs text-muted-foreground">Score 0-6</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>NPS Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{mockNPSData.score}</div>
                  <p className="text-muted-foreground">Based on {mockNPSData.totalResponses} responses</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Promoters ({mockNPSData.promoters}%)</span>
                    <span>Detractors ({mockNPSData.detractors}%)</span>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    NPS = {mockNPSData.promoters}% - {mockNPSData.detractors}% = {mockNPSData.score}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Rating Trends</h3>
                <p className="text-muted-foreground">Historical rating and NPS trend analysis</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
