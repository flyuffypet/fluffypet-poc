import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { corsHeaders } from "../_shared/cors.ts"
import { trackFunctionCall } from "../_shared/monitoring.ts"
import { Deno } from "https://deno.land/std@0.168.0/runtime.ts" // Declare Deno variable

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const openaiApiKey = Deno.env.get("OPENAI_API_KEY")

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

async function callOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
  if (!openaiApiKey) {
    // Fallback response when OpenAI is not configured
    return "AI analysis is currently unavailable. Please ensure your pet receives regular veterinary care and monitor for any changes in behavior or health."
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data: OpenAIResponse = await response.json()
    return data.choices[0]?.message?.content || "No response generated"
  } catch (error) {
    console.error("OpenAI API error:", error)
    // Return fallback response
    return "AI analysis is temporarily unavailable. Please consult with a veterinarian for professional advice about your pet's health."
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  const startTime = Date.now()
  let functionResult: any = null
  let error: Error | null = null

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const url = new URL(req.url)
    const path = url.pathname.split("/").pop()

    // Health check endpoint
    if (path === "health") {
      try {
        // Test database connectivity
        const { data, error: dbError } = await supabase.from("ai_analyses").select("count").limit(1).single()

        // Test OpenAI connectivity if API key is available
        let openaiStatus = "not_configured"
        if (openaiApiKey) {
          try {
            const testResponse = await fetch("https://api.openai.com/v1/models", {
              headers: { Authorization: `Bearer ${openaiApiKey}` },
            })
            openaiStatus = testResponse.ok ? "connected" : "error"
          } catch {
            openaiStatus = "error"
          }
        }

        functionResult = {
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: "connected",
          openai: openaiStatus,
          responseTime: Date.now() - startTime,
        }

        return new Response(JSON.stringify(functionResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        })
      } catch (healthError) {
        error = healthError as Error
        functionResult = {
          status: "unhealthy",
          timestamp: new Date().toISOString(),
          database: "disconnected",
          error: error.message,
        }

        return new Response(JSON.stringify(functionResult), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 503,
        })
      }
    }

    const { method } = req
    const authHeader = req.headers.get("Authorization")

    if (!authHeader) {
      throw new Error("Authorization header required")
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error("Invalid authentication token")
    }

    switch (method) {
      case "POST": {
        const body = await req.json()
        const { action, ...data } = body

        switch (action) {
          case "analyze-pet-health": {
            const { petId, symptoms, context } = data

            if (!petId) {
              throw new Error("petId is required")
            }

            // Get pet data
            const { data: pet, error: petError } = await supabase
              .from("pets")
              .select("*")
              .eq("id", petId)
              .eq("owner_id", user.id)
              .single()

            if (petError || !pet) {
              throw new Error("Pet not found or access denied")
            }

            // Create analysis prompt
            const systemPrompt = `You are a veterinary AI assistant. Provide helpful, general health information about pets. Always recommend consulting with a qualified veterinarian for proper diagnosis and treatment. Do not provide specific medical diagnoses.`

            const prompt = `Pet Information:
- Name: ${pet.name}
- Species: ${pet.species}
- Breed: ${pet.breed || "Mixed"}
- Age: ${pet.age || "Unknown"} years
- Weight: ${pet.weight || "Unknown"} kg

${symptoms ? `Reported symptoms: ${symptoms}` : ""}
${context ? `Additional context: ${context}` : ""}

Please provide general health guidance and care recommendations. Emphasize the importance of professional veterinary consultation.`

            const analysis = await callOpenAI(prompt, systemPrompt)

            // Store analysis
            const { data: analysisRecord, error: analysisError } = await supabase
              .from("ai_analyses")
              .insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                pet_id: petId,
                analysis_type: "health_analysis",
                input_data: { symptoms, context },
                result: analysis,
                created_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (analysisError) throw analysisError

            functionResult = {
              success: true,
              analysis,
              analysisId: analysisRecord.id,
            }
            break
          }

          case "generate-care-tips": {
            const { petId, category = "general" } = data

            if (!petId) {
              throw new Error("petId is required")
            }

            // Get pet data
            const { data: pet, error: petError } = await supabase
              .from("pets")
              .select("*")
              .eq("id", petId)
              .eq("owner_id", user.id)
              .single()

            if (petError || !pet) {
              throw new Error("Pet not found or access denied")
            }

            const systemPrompt = `You are a pet care expert. Provide practical, safe care tips for pet owners. Focus on general wellness, nutrition, exercise, and preventive care.`

            const prompt = `Generate ${category} care tips for:
- Pet: ${pet.name} (${pet.species})
- Breed: ${pet.breed || "Mixed breed"}
- Age: ${pet.age || "Unknown"} years

Provide 5-7 practical, actionable care tips that are safe and beneficial for this type of pet.`

            const tips = await callOpenAI(prompt, systemPrompt)

            // Store analysis
            const { data: analysisRecord, error: analysisError } = await supabase
              .from("ai_analyses")
              .insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                pet_id: petId,
                analysis_type: "care_tips",
                input_data: { category },
                result: tips,
                created_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (analysisError) throw analysisError

            functionResult = {
              success: true,
              tips,
              analysisId: analysisRecord.id,
            }
            break
          }

          case "general-query": {
            const { query, petId } = data

            if (!query) {
              throw new Error("query is required")
            }

            let petContext = ""
            if (petId) {
              const { data: pet, error: petError } = await supabase
                .from("pets")
                .select("*")
                .eq("id", petId)
                .eq("owner_id", user.id)
                .single()

              if (pet && !petError) {
                petContext = `Context: User is asking about their pet ${pet.name} (${pet.species}, ${pet.breed || "Mixed breed"}).`
              }
            }

            const systemPrompt = `You are a helpful pet care assistant. Provide accurate, helpful information about pet care, health, and behavior. Always recommend consulting professionals for serious health concerns.`

            const prompt = `${petContext}\n\nUser question: ${query}`

            const response = await callOpenAI(prompt, systemPrompt)

            // Store analysis
            const { data: analysisRecord, error: analysisError } = await supabase
              .from("ai_analyses")
              .insert({
                id: crypto.randomUUID(),
                user_id: user.id,
                pet_id: petId,
                analysis_type: "general_query",
                input_data: { query },
                result: response,
                created_at: new Date().toISOString(),
              })
              .select()
              .single()

            if (analysisError) throw analysisError

            functionResult = {
              success: true,
              response,
              analysisId: analysisRecord.id,
            }
            break
          }

          default:
            throw new Error(`Unknown action: ${action}`)
        }
        break
      }

      case "GET": {
        const url = new URL(req.url)
        const action = url.searchParams.get("action")

        switch (action) {
          case "get-analyses": {
            const petId = url.searchParams.get("petId")
            const limit = Number.parseInt(url.searchParams.get("limit") || "10")

            let query = supabase
              .from("ai_analyses")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(limit)

            if (petId) {
              query = query.eq("pet_id", petId)
            }

            const { data: analyses, error: analysesError } = await query

            if (analysesError) throw analysesError

            functionResult = {
              success: true,
              analyses: analyses || [],
            }
            break
          }

          default:
            throw new Error(`Unknown action: ${action}`)
        }
        break
      }

      default:
        throw new Error(`Method ${method} not allowed`)
    }

    // Track successful function call
    await trackFunctionCall(supabase, {
      function_name: "ai",
      user_id: user.id,
      action: req.method,
      success: true,
      response_time: Date.now() - startTime,
      metadata: {
        path,
        action: req.method === "POST" ? (await req.clone().json()).action : url.searchParams.get("action"),
      },
    })

    return new Response(JSON.stringify(functionResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (err) {
    error = err as Error
    console.error("AI function error:", error)

    // Track failed function call
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      await trackFunctionCall(supabase, {
        function_name: "ai",
        user_id: null,
        action: req.method,
        success: false,
        response_time: Date.now() - startTime,
        error_message: error.message,
        metadata: { error: error.stack },
      })
    } catch (trackingError) {
      console.error("Failed to track error:", trackingError)
    }

    return new Response(
      JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
