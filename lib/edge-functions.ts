import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface EdgeFunctionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
}

export interface AuthSignupData {
  email: string
  password: string
  userData: {
    full_name: string
    role: string
  }
}

export interface AuthSigninData {
  email: string
  password: string
}

export interface MediaUploadData {
  fileName: string
  fileType: string
  petId?: string
  fileSize?: number
}

export interface ChatMessageData {
  conversationId: string
  content: string
  messageType?: "text" | "image" | "file"
}

export interface AIAnalysisData {
  petId: string
  symptoms?: string
  context?: string
}

export class EdgeFunctionsClient {
  private supabase = createClient(supabaseUrl, supabaseAnonKey)
  private baseUrl: string

  constructor() {
    this.baseUrl = `${supabaseUrl}/functions/v1`
  }

  private async makeRequest<T>(
    functionName: string,
    options: {
      method?: "GET" | "POST" | "PUT" | "DELETE"
      body?: any
      params?: Record<string, string>
    } = {},
  ): Promise<EdgeFunctionResponse<T>> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession()

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`
      }

      let url = `${this.baseUrl}/${functionName}`
      if (options.params) {
        const searchParams = new URLSearchParams(options.params)
        url += `?${searchParams.toString()}`
      }

      const response = await fetch(url, {
        method: options.method || "POST",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      })

      const result = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}`,
          timestamp: result.timestamp,
        }
      }

      return {
        success: true,
        data: result,
        timestamp: result.timestamp,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Auth Functions
  async signup(data: AuthSignupData): Promise<EdgeFunctionResponse> {
    return this.makeRequest("auth", {
      method: "POST",
      body: { action: "signup", ...data },
    })
  }

  async signin(data: AuthSigninData): Promise<EdgeFunctionResponse> {
    return this.makeRequest("auth", {
      method: "POST",
      body: { action: "signin", ...data },
    })
  }

  async resetPassword(email: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("auth", {
      method: "POST",
      body: { action: "reset-password", email },
    })
  }

  async updatePassword(password: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("auth", {
      method: "POST",
      body: { action: "update-password", password },
    })
  }

  // Media Functions
  async generateUploadUrl(data: MediaUploadData): Promise<EdgeFunctionResponse> {
    return this.makeRequest("media", {
      method: "POST",
      body: { action: "generate-upload-url", ...data },
    })
  }

  async generateSignedUrl(filePath: string, expiresIn = 3600): Promise<EdgeFunctionResponse> {
    return this.makeRequest("media", {
      method: "POST",
      body: { action: "generate-signed-url", filePath, expiresIn },
    })
  }

  async confirmUpload(mediaId: string, metadata?: any): Promise<EdgeFunctionResponse> {
    return this.makeRequest("media", {
      method: "POST",
      body: { action: "confirm-upload", mediaId, metadata },
    })
  }

  async deleteFile(filePath: string, mediaId?: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("media", {
      method: "POST",
      body: { action: "delete-file", filePath, mediaId },
    })
  }

  async listMedia(petId?: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("media", {
      method: "GET",
      params: { action: "list-media", ...(petId && { petId }) },
    })
  }

  // Chat Functions
  async createConversation(participantId: string, bookingId?: string, title?: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("chat", {
      method: "POST",
      body: { action: "create-conversation", participantId, bookingId, title },
    })
  }

  async sendMessage(data: ChatMessageData): Promise<EdgeFunctionResponse> {
    return this.makeRequest("chat", {
      method: "POST",
      body: { action: "send-message", ...data },
    })
  }

  async markAsRead(conversationId: string, messageId?: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("chat", {
      method: "POST",
      body: { action: "mark-as-read", conversationId, messageId },
    })
  }

  async listConversations(): Promise<EdgeFunctionResponse> {
    return this.makeRequest("chat", {
      method: "GET",
      params: { action: "list-conversations" },
    })
  }

  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<EdgeFunctionResponse> {
    return this.makeRequest("chat", {
      method: "GET",
      params: {
        action: "get-messages",
        conversationId,
        limit: limit.toString(),
        offset: offset.toString(),
      },
    })
  }

  // AI Functions
  async analyzePetHealth(data: AIAnalysisData): Promise<EdgeFunctionResponse> {
    return this.makeRequest("ai", {
      method: "POST",
      body: { action: "analyze-pet-health", ...data },
    })
  }

  async generateCareTips(petId: string, category = "general"): Promise<EdgeFunctionResponse> {
    return this.makeRequest("ai", {
      method: "POST",
      body: { action: "generate-care-tips", petId, category },
    })
  }

  async generalQuery(query: string, petId?: string): Promise<EdgeFunctionResponse> {
    return this.makeRequest("ai", {
      method: "POST",
      body: { action: "general-query", query, petId },
    })
  }

  async getAnalyses(petId?: string, limit = 10): Promise<EdgeFunctionResponse> {
    return this.makeRequest("ai", {
      method: "GET",
      params: {
        action: "get-analyses",
        ...(petId && { petId }),
        limit: limit.toString(),
      },
    })
  }

  // Health Check Functions
  async checkHealth(functionName: "auth" | "media" | "chat" | "ai"): Promise<EdgeFunctionResponse> {
    return this.makeRequest(`${functionName}/health`, {
      method: "GET",
    })
  }

  async checkAllHealth(): Promise<Record<string, EdgeFunctionResponse>> {
    const functions = ["auth", "media", "chat", "ai"] as const
    const results: Record<string, EdgeFunctionResponse> = {}

    await Promise.all(
      functions.map(async (func) => {
        results[func] = await this.checkHealth(func)
      }),
    )

    return results
  }
}

// Export singleton instance
export const edgeFunctions = new EdgeFunctionsClient()

// Export types
export type { EdgeFunctionResponse, AuthSignupData, AuthSigninData, MediaUploadData, ChatMessageData, AIAnalysisData }
