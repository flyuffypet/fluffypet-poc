interface AuthResponse {
  success: boolean
  message?: string
  user?: any
  error?: string
}

interface ChatMessage {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  created_at: string
  read: boolean
}

interface ChatResponse {
  success: boolean
  messages?: ChatMessage[]
  message?: ChatMessage
  error?: string
}

class EdgeFunctions {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1"
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}/${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async signUp(email: string, password: string, userData?: any): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest("auth", {
        method: "POST",
        body: JSON.stringify({
          action: "signup",
          email,
          password,
          userData,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signup failed",
      }
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest("auth", {
        method: "POST",
        body: JSON.stringify({
          action: "signin",
          email,
          password,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Signin failed",
      }
    }
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest("auth", {
        method: "POST",
        body: JSON.stringify({
          action: "reset-password",
          email,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password reset failed",
      }
    }
  }

  async updatePassword(password: string, accessToken: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest("auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "update-password",
          password,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Password update failed",
      }
    }
  }

  async sendMessage(recipientId: string, content: string, accessToken: string): Promise<ChatResponse> {
    try {
      const response = await this.makeRequest("chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "send",
          recipientId,
          content,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send message",
      }
    }
  }

  async getMessages(conversationId: string, accessToken: string, limit = 50): Promise<ChatResponse> {
    try {
      const response = await this.makeRequest("chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "get-messages",
          conversationId,
          limit,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get messages",
      }
    }
  }

  async markAsRead(messageId: string, accessToken: string): Promise<ChatResponse> {
    try {
      const response = await this.makeRequest("chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "mark-read",
          messageId,
        }),
      })

      return response
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to mark message as read",
      }
    }
  }
}

export const authFunctions = new EdgeFunctions()
export const chatFunctions = new EdgeFunctions()

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

export default EdgeFunctions
