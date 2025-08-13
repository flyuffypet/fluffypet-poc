import { createClient } from "@/lib/supabase-client"

export interface EdgeFunctionResponse<T = any> {
  data?: T
  error?: string
}

class EdgeFunctions {
  private supabase = createClient()

  async getCurrentUserToken(): Promise<string | null> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession()
    return session?.access_token || null
  }

  async invokeFunction<T = any>(
    functionName: string,
    body?: any,
    options?: {
      headers?: Record<string, string>
    },
  ): Promise<EdgeFunctionResponse<T>> {
    try {
      const token = await this.getCurrentUserToken()

      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          ...options?.headers,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Function invocation failed",
      }
    }
  }

  // Auth functions
  async signUp(email: string, password: string, metadata?: any) {
    return this.invokeFunction("auth", {
      action: "signup",
      email,
      password,
      metadata,
    })
  }

  async signIn(email: string, password: string) {
    return this.invokeFunction("auth", {
      action: "signin",
      email,
      password,
    })
  }

  async resetPassword(email: string) {
    return this.invokeFunction("auth", {
      action: "reset-password",
      email,
    })
  }

  // Chat functions
  async sendMessage(chatId: string, message: string, recipientId: string) {
    return this.invokeFunction("chat", {
      action: "send-message",
      chatId,
      message,
      recipientId,
    })
  }

  async getChatHistory(chatId: string, limit?: number) {
    return this.invokeFunction("chat", {
      action: "get-history",
      chatId,
      limit,
    })
  }

  async createChat(participantIds: string[]) {
    return this.invokeFunction("chat", {
      action: "create-chat",
      participantIds,
    })
  }

  // Media functions
  async processMedia(fileUrl: string, operations: any[]) {
    return this.invokeFunction("media", {
      action: "process",
      fileUrl,
      operations,
    })
  }

  async generateThumbnail(fileUrl: string, width: number, height: number) {
    return this.invokeFunction("media", {
      action: "generate-thumbnail",
      fileUrl,
      width,
      height,
    })
  }

  // AI functions
  async analyzeImage(imageUrl: string, prompt?: string) {
    return this.invokeFunction("ai", {
      action: "analyze-image",
      imageUrl,
      prompt,
    })
  }

  async generateInsights(petData: any) {
    return this.invokeFunction("ai", {
      action: "generate-insights",
      petData,
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

export const edgeFunctions = new EdgeFunctions()

// Export individual function groups for convenience
export const authFunctions = {
  signUp: edgeFunctions.signUp.bind(edgeFunctions),
  signIn: edgeFunctions.signIn.bind(edgeFunctions),
  resetPassword: edgeFunctions.resetPassword.bind(edgeFunctions),
}

export const chatFunctions = {
  sendMessage: edgeFunctions.sendMessage.bind(edgeFunctions),
  getChatHistory: edgeFunctions.getChatHistory.bind(edgeFunctions),
  createChat: edgeFunctions.createChat.bind(edgeFunctions),
}

export const mediaFunctions = {
  processMedia: edgeFunctions.processMedia.bind(edgeFunctions),
  generateThumbnail: edgeFunctions.generateThumbnail.bind(edgeFunctions),
}

export const aiFunctions = {
  analyzeImage: edgeFunctions.analyzeImage.bind(edgeFunctions),
  generateInsights: edgeFunctions.generateInsights.bind(edgeFunctions),
  chatWithAI: edgeFunctions.chatWithAI.bind(edgeFunctions),
}

export const getCurrentUserToken = edgeFunctions.getCurrentUserToken.bind(edgeFunctions)
export default edgeFunctions
