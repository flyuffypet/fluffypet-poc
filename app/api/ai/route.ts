import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Uses the OPENAI_API_KEY environment variable.
export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: prompt || "Write a friendly welcome message for FluffyPet users.",
    })

    return NextResponse.json({ text })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
