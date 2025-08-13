"use client"

interface EdgeFunctionResponse<T = any> {
  data?: T
  error?: string
}

class EdgeFunctionsService {
  private baseUrl = "/api"

  async callFunction<T = any>(
    functionName: string,
    payload?: any,
    options?: RequestInit,
  ): Promise<EdgeFunctionResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${functionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: payload ? JSON.stringify(payload) : undefined,
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Function call failed",
      }
    }
  }

  // Auth functions
  async signUp(email: string, password: string) {
    return this.callFunction("auth/signup", { email, password })
  }

  async signIn(email: string, password: string) {
    return this.callFunction("auth/signin", { email, password })
  }

  async resetPassword(email: string) {
    return this.callFunction("auth/reset-password", { email })
  }

  // Chat functions
  async sendMessage(conversationId: string, message: string) {
    return this.callFunction("chat/send", { conversationId, message })
  }

  async getMessages(conversationId: string) {
    return this.callFunction("chat/messages", { conversationId })
  }

  // AI functions
  async analyzeHealthData(petData: any) {
    return this.callFunction("ai/health-analysis", { petData })
  }

  async generateInsights(petId: string) {
    return this.callFunction("ai/insights", { petId })
  }

  // Media functions
  async processMedia(fileUrl: string, type: string) {
    return this.callFunction("media/process", { fileUrl, type })
  }
}

export const edgeFunctions = new EdgeFunctionsService()

// Export individual functions for convenience
export const chatFunctions = {
  sendMessage: edgeFunctions.sendMessage.bind(edgeFunctions),
  getMessages: edgeFunctions.getMessages.bind(edgeFunctions),
}

export const authFunctions = {
  signUp: edgeFunctions.signUp.bind(edgeFunctions),
  signIn: edgeFunctions.signIn.bind(edgeFunctions),
  resetPassword: edgeFunctions.resetPassword.bind(edgeFunctions),
}

export const aiFunctions = {
  analyzeHealthData: edgeFunctions.analyzeHealthData.bind(edgeFunctions),
  generateInsights: edgeFunctions.generateInsights.bind(edgeFunctions),
}
