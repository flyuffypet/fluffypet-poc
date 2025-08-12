import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Edge Function URLs
const EDGE_FUNCTION_BASE_URL = `${supabaseUrl}/functions/v1`

// Helper function to call edge functions
async function callEdgeFunction(functionName: string, payload: any, authToken?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(`${EDGE_FUNCTION_BASE_URL}/${functionName}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Edge function call failed")
  }

  return response.json()
}

// Authentication functions
export const authFunctions = {
  async signUp(email: string, password: string, userData?: any) {
    return callEdgeFunction("auth", {
      action: "signup",
      email,
      password,
      userData,
    })
  },

  async signIn(email: string, password: string) {
    return callEdgeFunction("auth", {
      action: "signin",
      email,
      password,
    })
  },

  async resetPassword(email: string) {
    return callEdgeFunction("auth", {
      action: "reset-password",
      email,
    })
  },

  async updatePassword(newPassword: string, authToken: string) {
    return callEdgeFunction(
      "auth",
      {
        action: "update-password",
        newPassword,
      },
      authToken,
    )
  },
}

// Media functions
export const mediaFunctions = {
  async generateUploadUrl(fileName: string, fileType: string, folder?: string, authToken?: string) {
    return callEdgeFunction(
      "media",
      {
        action: "generate-upload-url",
        fileName,
        fileType,
        folder,
      },
      authToken,
    )
  },

  async createSignedUrl(filePath: string, expiresIn = 3600, authToken?: string) {
    return callEdgeFunction(
      "media",
      {
        action: "create-signed-url",
        filePath,
        expiresIn,
      },
      authToken,
    )
  },

  async deleteFile(filePath: string, authToken?: string) {
    return callEdgeFunction(
      "media",
      {
        action: "delete-file",
        filePath,
      },
      authToken,
    )
  },

  async saveMediaRecord(
    petId: string,
    mediaType: string,
    description: string,
    storagePath: string,
    publicUrl: string,
    authToken?: string,
  ) {
    return callEdgeFunction(
      "media",
      {
        action: "save-media-record",
        petId,
        mediaType,
        description,
        storagePath,
        publicUrl,
      },
      authToken,
    )
  },
}

// Chat functions
export const chatFunctions = {
  async createConversation(recipientId: string, authToken: string) {
    return callEdgeFunction(
      "chat",
      {
        action: "create-conversation",
        recipientId,
      },
      authToken,
    )
  },

  async sendMessage(conversationId: string, message: string, messageType = "text", authToken?: string) {
    return callEdgeFunction(
      "chat",
      {
        action: "send-message",
        conversationId,
        message,
        messageType,
      },
      authToken,
    )
  },

  async markRead(conversationId: string, authToken?: string) {
    return callEdgeFunction(
      "chat",
      {
        action: "mark-read",
        conversationId,
      },
      authToken,
    )
  },

  async getConversations(authToken?: string) {
    return callEdgeFunction(
      "chat",
      {
        action: "get-conversations",
      },
      authToken,
    )
  },
}

// AI functions
export const aiFunctions = {
  async analyzeHealth(petId: string, symptoms?: string, authToken?: string) {
    return callEdgeFunction(
      "ai",
      {
        action: "analyze-pet-health",
        petId,
        symptoms,
      },
      authToken,
    )
  },

  async generateCareTips(petId: string, authToken?: string) {
    return callEdgeFunction(
      "ai",
      {
        action: "generate-care-tips",
        petId,
      },
      authToken,
    )
  },

  async generalQuery(question: string, authToken?: string) {
    return callEdgeFunction(
      "ai",
      {
        action: "general-query",
        question,
      },
      authToken,
    )
  },
}

// Helper to get current user's auth token
export async function getCurrentUserToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token
}
