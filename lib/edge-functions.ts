"use client"

import { createClient } from "@/lib/supabase-client"

export interface EdgeFunctionResponse<T = any> {
  data?: T
  error?: string
}

export class EdgeFunctionsService {
  private supabase = createClient()

  async invokeFunction<T = any>(functionName: string, payload?: any): Promise<EdgeFunctionResponse<T>> {
    try {
      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: payload,
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
  async getCurrentUserToken(): Promise<EdgeFunctionResponse<{ token: string }>> {
    return this.invokeFunction("auth", { action: "get-token" })
  }

  async refreshUserSession(): Promise<EdgeFunctionResponse<{ session: any }>> {
    return this.invokeFunction("auth", { action: "refresh-session" })
  }

  // Media functions
  async processImage(
    imageUrl: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: string
    },
  ): Promise<EdgeFunctionResponse<{ processedUrl: string }>> {
    return this.invokeFunction("media", {
      action: "process-image",
      imageUrl,
      options,
    })
  }

  async generateThumbnail(imageUrl: string, size = 150): Promise<EdgeFunctionResponse<{ thumbnailUrl: string }>> {
    return this.invokeFunction("media", {
      action: "generate-thumbnail",
      imageUrl,
      size,
    })
  }

  // Chat functions
  async sendMessage(
    conversationId: string,
    message: string,
    attachments?: string[],
  ): Promise<EdgeFunctionResponse<{ messageId: string }>> {
    return this.invokeFunction("chat", {
      action: "send-message",
      conversationId,
      message,
      attachments,
    })
  }

  async createConversation(
    participants: string[],
    type: "direct" | "group" = "direct",
  ): Promise<EdgeFunctionResponse<{ conversationId: string }>> {
    return this.invokeFunction("chat", {
      action: "create-conversation",
      participants,
      type,
    })
  }

  // AI functions
  async analyzeHealthData(petId: string, healthData: any): Promise<EdgeFunctionResponse<{ insights: any[] }>> {
    return this.invokeFunction("ai", {
      action: "analyze-health",
      petId,
      healthData,
    })
  }

  async generateHealthRecommendations(petId: string): Promise<EdgeFunctionResponse<{ recommendations: any[] }>> {
    return this.invokeFunction("ai", {
      action: "generate-recommendations",
      petId,
    })
  }
}

export const edgeFunctions = new EdgeFunctionsService()

// Export individual functions for convenience
export const chatFunctions = {
  sendMessage: edgeFunctions.sendMessage.bind(edgeFunctions),
  createConversation: edgeFunctions.createConversation.bind(edgeFunctions),
}

export const mediaFunctions = {
  processImage: edgeFunctions.processImage.bind(edgeFunctions),
  generateThumbnail: edgeFunctions.generateThumbnail.bind(edgeFunctions),
}

export const aiFunctions = {
  analyzeHealthData: edgeFunctions.analyzeHealthData.bind(edgeFunctions),
  generateHealthRecommendations: edgeFunctions.generateHealthRecommendations.bind(edgeFunctions),
}

export const authFunctions = {
  getCurrentUserToken: edgeFunctions.getCurrentUserToken.bind(edgeFunctions),
  refreshUserSession: edgeFunctions.refreshUserSession.bind(edgeFunctions),
}
