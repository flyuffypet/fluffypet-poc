"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function ChatDemo() {
  const [prompt, setPrompt] = useState("Create a friendly appointment reminder for a vet visit.")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  async function onSend() {
    setLoading(true)
    setResult("")
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) throw new Error("AI request failed")
      const data = await res.json()
      setResult(data.text || "")
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
      <Button onClick={onSend} disabled={loading}>
        {loading ? "Thinking..." : "Generate"}
      </Button>
      {result && <div className="whitespace-pre-wrap rounded-md border p-3 text-sm">{result}</div>}
    </div>
  )
}
