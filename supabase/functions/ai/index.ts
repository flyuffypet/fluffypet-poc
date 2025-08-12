import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    const authHeader = req.headers.get("Authorization")
    if (!authHeader) throw new Error("No authorization header")

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(authHeader.replace("Bearer ", ""))

    if (authError || !user) throw new Error("Unauthorized")

    const { action, petId, symptoms, question } = await req.json()

    switch (action) {
      case "analyze-pet-health": {
        if (!petId) throw new Error("petId is required")

        // Get pet data
        const { data: pet, error: petError } = await supabaseClient
          .from("pets")
          .select("*")
          .eq("id", petId)
          .eq("owner_id", user.id)
          .single()

        if (petError || !pet) throw new Error("Pet not found or access denied")

        // Prepare AI prompt
        const aiPrompt = `
          Analyze the health of this pet:
          
          Pet Details:
          - Name: ${pet.name}
          - Species: ${pet.species}
          - Breed: ${pet.breed}
          - Age: ${pet.age}
          - Weight: ${pet.weight}
          
          Current Symptoms: ${symptoms || "None reported"}
          
          Please provide:
          1. Health assessment
          2. Recommendations
          3. Urgency level (low/medium/high)
          4. When to see a vet
          
          Keep response concise and helpful.
        `

        // For now, return a mock response since we don't have OpenAI API key in this environment
        const analysis = `Based on the information provided for ${pet.name}, here's a general health assessment:

1. **Health Assessment**: Without specific symptoms, ${pet.name} appears to be in normal condition for a ${pet.age}-year-old ${pet.breed}.

2. **Recommendations**: 
   - Maintain regular feeding schedule
   - Ensure adequate exercise for breed and age
   - Keep up with routine grooming

3. **Urgency Level**: Low (routine care)

4. **Vet Visit**: Schedule regular check-up within 6 months if no symptoms present.

*Note: This is a general assessment. Always consult with a qualified veterinarian for specific health concerns.*`

        // Save analysis to database
        const { data: savedAnalysis, error: saveError } = await supabaseClient
          .from("ai_analyses")
          .insert({
            pet_id: petId,
            user_id: user.id,
            type: "health_analysis",
            input: symptoms || "General health check",
            output: analysis,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (saveError) {
          console.error("Failed to save analysis:", saveError)
        }

        return new Response(
          JSON.stringify({
            analysis,
            analysisId: savedAnalysis?.id,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }

      case "generate-care-tips": {
        if (!petId) throw new Error("petId is required")

        // Get pet data
        const { data: pet, error: petError } = await supabaseClient
          .from("pets")
          .select("*")
          .eq("id", petId)
          .eq("owner_id", user.id)
          .single()

        if (petError || !pet) throw new Error("Pet not found or access denied")

        const careTips = `Here are personalized care tips for ${pet.name}:

**Nutrition Tips:**
- Feed high-quality ${pet.species} food appropriate for ${pet.age} years old
- Maintain consistent feeding schedule
- Monitor weight regularly

**Exercise & Activity:**
- Provide daily exercise suitable for ${pet.breed}
- Mental stimulation through play and training
- Regular outdoor activities if applicable

**Health Monitoring:**
- Weekly health checks at home
- Watch for changes in behavior or appetite
- Keep vaccination schedule up to date

**Grooming:**
- Regular brushing based on coat type
- Nail trimming as needed
- Dental care routine

**Environment:**
- Safe, comfortable living space
- Temperature control appropriate for breed
- Clean water always available`

        return new Response(JSON.stringify({ careTips }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      case "general-query": {
        if (!question) throw new Error("question is required")

        const response = `Thank you for your question about pet care. Here's some general guidance:

For specific questions about "${question}", I recommend:

1. **Consult Resources**: Check reputable pet care websites and guides
2. **Professional Advice**: Contact your veterinarian for health-related questions
3. **Community Support**: Connect with other pet owners in FluffyPet community
4. **Emergency Care**: If urgent, contact emergency veterinary services

*This is general guidance. Always consult with qualified professionals for specific pet care needs.*`

        return new Response(JSON.stringify({ response }), {
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
