"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Bot, Stethoscope } from "lucide-react"
import { aiFunctions, getCurrentUserToken } from "@/lib/edge-functions"

export default function ChatDemo() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)

  const handleGeneralQuery = async () => {
    if (!question.trim()) return

    setLoading(true)
    setResponse("")

    try {
      const authToken = await getCurrentUserToken()
      const result = await aiFunctions.generalQuery(question, authToken)
      setResponse(result.response || "No response received")
    } catch (error: any) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleHealthAnalysis = async () => {
    if (!selectedPetId) return

    setLoading(true)
    setResponse("")

    try {
      const authToken = await getCurrentUserToken()
      const result = await aiFunctions.analyzeHealth(selectedPetId, question, authToken)
      setResponse(result.analysis || "No analysis available")
    } catch (error: any) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCareTips = async () => {
    if (!selectedPetId) return

    setLoading(true)
    setResponse("")

    try {
      const authToken = await getCurrentUserToken()
      const result = await aiFunctions.generateCareTips(selectedPetId, authToken)
      setResponse(result.tips || "No tips available")
    } catch (error: any) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Ask a question or describe symptoms:</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., My dog has been limping and seems tired..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pet ID (for health analysis):</label>
            <Input
              value={selectedPetId || ""}
              onChange={(e) => setSelectedPetId(e.target.value)}
              placeholder="Enter pet ID for health-specific queries"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGeneralQuery} disabled={loading || !question.trim()}>
              <MessageCircle className="h-4 w-4 mr-2" />
              General Query
            </Button>

            <Button
              onClick={handleHealthAnalysis}
              disabled={loading || !question.trim() || !selectedPetId}
              variant="outline"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Health Analysis
            </Button>

            <Button onClick={handleCareTips} disabled={loading || !selectedPetId} variant="outline">
              Generate Care Tips
            </Button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Processing your request...
            </div>
          )}

          {response && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <Bot className="h-4 w-4 mt-0.5 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    AI Response
                  </Badge>
                </div>
                <div className="text-sm whitespace-pre-wrap">{response}</div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
