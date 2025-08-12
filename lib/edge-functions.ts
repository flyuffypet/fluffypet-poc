import { getSupabaseBrowserClient } from "./supabase-client"

const FUNCTIONS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("/rest/v1", "/functions/v1")

class EdgeFunctionClient {
  private supabase = getSupabaseBrowserClient()

  private async callFunction(functionName: string, payload: any) {
    const {
      data: { session },
    } = await this.supabase.auth.getSession()

    const response = await fetch(`${FUNCTIONS_URL}/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Function call failed")
    }

    return response.json()
  }

  // Auth functions
  async signup(email: string, password: string, userData: any) {
    return this.callFunction("auth", {
      action: "signup",
      email,
      password,
      userData,
    })
  }

  async signin(email: string, password: string) {
    return this.callFunction("auth", {
      action: "signin",
      email,
      password,
    })
  }

  async resetPassword(email: string) {
    return this.callFunction("auth", {
      action: "reset-password",
      email,
    })
  }

  async updatePassword(password: string, accessToken: string) {
    return this.callFunction("auth", {
      action: "update-password",
      password,
      accessToken,
    })
  }

  // Media functions
  async generateUploadUrl(fileName: string, fileType: string, bucket = "media", folder?: string) {
    return this.callFunction("media", {
      action: "generate-upload-url",
      fileName,
      fileType,
      bucket,
      folder,
    })
  }

  async createSignedUrl(path: string, bucket = "media", expiresIn = 3600) {
    return this.callFunction("media", {
      action: "create-signed-url",
      path,
      bucket,
      expiresIn,
    })
  }

  async saveMediaRecord(
    petId: string,
    type: string,
    filename: string,
    path: string,
    mimeType: string,
    size: number,
    metadata?: any,
  ) {
    return this.callFunction("media", {
      action: "save-media-record",
      petId,
      type,
      filename,
      path,
      mimeType,
      size,
      metadata,
    })
  }

  async deleteMedia(mediaId: string, path: string, bucket = "media") {
    return this.callFunction("media", {
      action: "delete-media",
      mediaId,
      path,
      bucket,
    })
  }

  // Chat functions
  async createConversation(participantId: string, type = "direct", contextId?: string) {
    return this.callFunction("chat", {
      action: "create-conversation",
      participantId,
      type,
      contextId,
    })
  }

  async sendMessage(conversationId: string, content: string, messageType = "text") {
    return this.callFunction("chat", {
      action: "send-message",
      conversationId,
      content,
      messageType,
    })
  }

  async getMessages(conversationId: string, limit = 50, offset = 0) {
    return this.callFunction("chat", {
      action: "get-messages",
      conversationId,
      limit,
      offset,
    })
  }

  async markAsRead(conversationId: string) {
    return this.callFunction("chat", {
      action: "mark-as-read",
      conversationId,
    })
  }

  async getConversations(limit = 20, offset = 0) {
    return this.callFunction("chat", {
      action: "get-conversations",
      limit,
      offset,
    })
  }

  // AI functions
  async analyzePetHealth(petId: string, symptoms: string) {
    return this.callFunction("ai", {
      action: "analyze-pet-health",
      petId,
      symptoms,
    })
  }

  async generateCareTips(petId: string, category = "general") {
    return this.callFunction("ai", {
      action: "generate-care-tips",
      petId,
      category,
    })
  }

  async generalQuery(question: string) {
    return this.callFunction("ai", {
      action: "general-query",
      question,
    })
  }
}

export const edgeFunctions = new EdgeFunctionClient()
