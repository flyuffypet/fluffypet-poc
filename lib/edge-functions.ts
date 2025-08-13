import { createClient } from "@/lib/supabase-client"

export interface EdgeFunctionResponse<T = any> {
  data?: T
  error?: string
  success: boolean
}

export class EdgeFunctionsService {
  private supabase = createClient()

  async invokeFunction<T = any>(functionName: string, payload?: any): Promise<EdgeFunctionResponse<T>> {
    try {
      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: payload,
      })

      if (error) {
        console.error(`Edge function ${functionName} error:`, error)
        return {
          success: false,
          error: error.message,
        }
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error(`Edge function ${functionName} exception:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Function call failed",
      }
    }
  }

  // Auth functions
  async sendWelcomeEmail(userId: string, email: string) {
    return this.invokeFunction("auth", {
      action: "send_welcome_email",
      userId,
      email,
    })
  }

  async sendPasswordResetEmail(email: string) {
    return this.invokeFunction("auth", {
      action: "send_password_reset",
      email,
    })
  }

  // Media functions
  async processImage(imageUrl: string, transformations: any) {
    return this.invokeFunction("media", {
      action: "process_image",
      imageUrl,
      transformations,
    })
  }

  async generateThumbnail(imageUrl: string, size = 200) {
    return this.invokeFunction("media", {
      action: "generate_thumbnail",
      imageUrl,
      size,
    })
  }

  // Chat functions
  async sendMessage(conversationId: string, message: any) {
    return this.invokeFunction("chat", {
      action: "send_message",
      conversationId,
      message,
    })
  }

  async createConversation(participants: string[]) {
    return this.invokeFunction("chat", {
      action: "create_conversation",
      participants,
    })
  }

  // AI functions
  async analyzePetHealth(petData: any, symptoms?: string[]) {
    return this.invokeFunction("ai", {
      action: "analyze_pet_health",
      petData,
      symptoms,
    })
  }

  async generateHealthInsights(petId: string) {
    return this.invokeFunction("ai", {
      action: "generate_health_insights",
      petId,
    })
  }

  async chatWithAI(message: string, context?: any) {
    return this.invokeFunction("ai", {
      action: "chat",
      message,
      context,
    })
  }
}

export const edgeFunctions = new EdgeFunctionsService()

// Specific function helpers
export const authFunctions = {
  sendWelcomeEmail: (userId: string, email: string) => edgeFunctions.sendWelcomeEmail(userId, email),
  sendPasswordResetEmail: (email: string) => edgeFunctions.sendPasswordResetEmail(email),
}

export const mediaFunctions = {
  processImage: (imageUrl: string, transformations: any) => edgeFunctions.processImage(imageUrl, transformations),
  generateThumbnail: (imageUrl: string, size?: number) => edgeFunctions.generateThumbnail(imageUrl, size),
}

export const chatFunctions = {
  sendMessage: (conversationId: string, message: any) => edgeFunctions.sendMessage(conversationId, message),
  createConversation: (participants: string[]) => edgeFunctions.createConversation(participants),
}

export const aiFunctions = {
  analyzePetHealth: (petData: any, symptoms?: string[]) => edgeFunctions.analyzePetHealth(petData, symptoms),
  generateHealthInsights: (petId: string) => edgeFunctions.generateHealthInsights(petId),
  chatWithAI: (message: string, context?: any) => edgeFunctions.chatWithAI(message, context),
}

// Helper to get current user token for authenticated requests
export async function getCurrentUserToken(): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}
