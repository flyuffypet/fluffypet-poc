import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const authHeader = req.headers.get("Authorization")!
    const token = authHeader.replace("Bearer ", "")

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)
    if (authError || !user) throw new Error("Unauthorized")

    const { action, ...body } = await req.json()

    switch (action) {
      case "analyze-pet-health": {
        const { petId, symptoms, question } = body

        // Get pet data
        const { data: pet, error: petError } = await supabase.from("pets").select("*").eq("id", petId).single()

        if (petError) throw petError

        // Prepare AI prompt
        const prompt = `
          As a veterinary AI assistant, analyze the following pet information and symptoms:
          
          Pet Details:
          - Name: ${pet.name}
          - Species: ${pet.species}
          - Breed: ${pet.breed}
          - Age: ${pet.age}
          - Weight: ${pet.weight}
          
          Symptoms/Question: ${symptoms || question}
          
          Please provide:
          1. Possible causes or conditions
          2. Recommended actions
          3. Urgency level (Low/Medium/High)
          4. When to see a vet
          
          Note: This is not a substitute for professional veterinary care.
        `

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful veterinary AI assistant. Provide helpful, accurate information while always recommending professional veterinary care for serious concerns.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        })

        const aiData = await response.json()
        const analysis = aiData.choices[0].message.content

        // Save analysis to database
        const { data: savedAnalysis, error: saveError } = await supabase
          .from("ai_analyses")
          .insert({
            pet_id: petId,
            user_id: user.id,
            type: "health_analysis",
            input: symptoms || question,
            output: analysis,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (saveError) throw saveError

        return new Response(
          JSON.stringify({
            analysis,
            analysisId: savedAnalysis.id,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
      }

      case "generate-care-tips": {
        const { petId, category = "general" } = body

        // Get pet data
        const { data: pet, error: petError } = await supabase.from("pets").select("*").eq("id", petId).single()

        if (petError) throw petError

        const prompt = `
          Generate personalized care tips for this pet:
          
          Pet Details:
          - Name: ${pet.name}
          - Species: ${pet.species}
          - Breed: ${pet.breed}
          - Age: ${pet.age}
          - Weight: ${pet.weight}
          
          Category: ${category}
          
          Provide 5-7 specific, actionable care tips tailored to this pet's characteristics.
        `

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a pet care expert. Provide practical, safe, and breed-specific care advice.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 800,
            temperature: 0.8,
          }),
        })

        const aiData = await response.json()
        const tips = aiData.choices[0].message.content

        return new Response(JSON.stringify({ tips }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "general-query": {
        const { question } = body

        const prompt = `
          Answer this pet-related question: ${question}
          
          Provide helpful, accurate information while being concise and practical.
        `

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content:
                  "You are a knowledgeable pet care assistant. Provide helpful information about pets, their care, behavior, and health.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 600,
            temperature: 0.7,
          }),
        })

        const aiData = await response.json()
        const answer = aiData.choices[0].message.content

        return new Response(JSON.stringify({ answer }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      default:
        throw new Error("Invalid action")
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
