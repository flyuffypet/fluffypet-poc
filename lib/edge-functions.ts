import { createClient } from "@/lib/supabase-client"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface EdgeFunctionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp?: string
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
  private supabase = createClient()
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

  // Media Functions using Supabase Storage
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

// Helper function to get current user token
export async function getCurrentUserToken(): Promise<string | null> {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}

// Simplified media functions for easier use
export const mediaFunctions = {
  async generateUploadUrl(fileName: string, fileType: string, folder?: string, token?: string) {
    const response = await edgeFunctions.generateUploadUrl({
      fileName,
      fileType,
      petId: folder,
    })
    if (!response.success) throw new Error(response.error)
    return response.data
  },

  async createSignedUrl(filePath: string, expiresIn = 3600, token?: string) {
    const response = await edgeFunctions.generateSignedUrl(filePath, expiresIn)
    if (!response.success) throw new Error(response.error)
    return response.data
  },

  async saveMediaRecord(petId: string, type: string, filename: string, path: string, url: string, token?: string) {
    // This would typically be handled by the media edge function
    // For now, we'll use direct Supabase client
    const supabase = createClient()
    const { data, error } = await supabase
      .from("pet_media")
      .insert({
        pet_id: petId,
        type,
        filename,
        path,
        url,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return { media: data }
  },

  async deleteFile(filePath: string, token?: string) {
    const response = await edgeFunctions.deleteFile(filePath)
    if (!response.success) throw new Error(response.error)
    return response.data
  },
}

// Auth Functions
export const authFunctions = {
  async resetPassword(email: string) {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
    return { success: true }
  },

  async updateUserRole(userId: string, role: string) {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

    if (error) throw error
    return { success: true }
  },
}

// Chat Functions
export const chatFunctions = {
  async sendMessage(conversationId: string, message: string, senderId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        content: message,
        sender_id: senderId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getMessages(conversationId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data
  },
}

// Export types
export type { EdgeFunctionResponse, MediaUploadData, ChatMessageData, AIAnalysisData }
