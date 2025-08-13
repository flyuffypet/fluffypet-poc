import { createClient } from "@/lib/supabase-client"

export interface EdgeFunctionResponse<T = any> {
  data: T | null
  error: string | null
}

class EdgeFunctionService {
  private supabase = createClient()

  async invokeFunction<T = any>(
    functionName: string,
    payload?: any,
    options?: {
      headers?: Record<string, string>
      method?: "POST" | "GET" | "PUT" | "DELETE"
    },
  ): Promise<EdgeFunctionResponse<T>> {
    try {
      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: payload,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        method: options?.method || "POST",
      })

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Function invocation failed",
      }
    }
  }

  async authenticateUser(email: string, password: string): Promise<EdgeFunctionResponse<{ user: any; session: any }>> {
    return this.invokeFunction("auth", {
      action: "login",
      email,
      password,
    })
  }

  async registerUser(
    email: string,
    password: string,
    userData?: any,
  ): Promise<EdgeFunctionResponse<{ user: any; session: any }>> {
    return this.invokeFunction("auth", {
      action: "register",
      email,
      password,
      userData,
    })
  }

  async resetPassword(email: string): Promise<EdgeFunctionResponse<{ message: string }>> {
    return this.invokeFunction("auth", {
      action: "reset-password",
      email,
    })
  }

  async updatePassword(accessToken: string, newPassword: string): Promise<EdgeFunctionResponse<{ message: string }>> {
    return this.invokeFunction(
      "auth",
      {
        action: "update-password",
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  }

  async sendChatMessage(
    conversationId: string,
    message: string,
    senderId: string,
  ): Promise<EdgeFunctionResponse<{ messageId: string }>> {
    return this.invokeFunction("chat", {
      action: "send-message",
      conversationId,
      message,
      senderId,
    })
  }

  async getChatHistory(
    conversationId: string,
    limit = 50,
    offset = 0,
  ): Promise<EdgeFunctionResponse<{ messages: any[] }>> {
    return this.invokeFunction("chat", {
      action: "get-history",
      conversationId,
      limit,
      offset,
    })
  }

  async createConversation(
    otherUserId: string,
    accessToken: string,
  ): Promise<EdgeFunctionResponse<{ conversationId: string }>> {
    return this.invokeFunction(
      "chat",
      {
        action: "create-conversation",
        otherUserId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
  }

  async uploadMedia(
    file: File,
    bucket: string,
    path?: string,
  ): Promise<EdgeFunctionResponse<{ url: string; path: string }>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("bucket", bucket)
    if (path) formData.append("path", path)

    return this.invokeFunction("media", formData, {
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
      },
    })
  }

  async deleteMedia(bucket: string, path: string): Promise<EdgeFunctionResponse<{ message: string }>> {
    return this.invokeFunction("media", {
      action: "delete",
      bucket,
      path,
    })
  }

  async generateAIInsight(
    petData: any,
    type: "health" | "behavior" | "nutrition",
  ): Promise<EdgeFunctionResponse<{ insight: string; recommendations: string[] }>> {
    return this.invokeFunction("ai", {
      action: "generate-insight",
      petData,
      type,
    })
  }

  async analyzeHealthData(healthRecords: any[]): Promise<EdgeFunctionResponse<{ analysis: any; alerts: any[] }>> {
    return this.invokeFunction("ai", {
      action: "analyze-health",
      healthRecords,
    })
  }
}

export const edgeFunctionService = new EdgeFunctionService()

// Export individual services for backward compatibility
export const authFunctions = edgeFunctionService
export const chatFunctions = edgeFunctionService

export async function getCurrentUserToken(): Promise<string | null> {
  try {
    const { createClient } = await import("@/lib/supabase-client")
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error("Failed to get user token:", error)
    return null
  }
}

export default edgeFunctionService
