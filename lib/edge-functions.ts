interface EdgeFunctionResponse<T = any> {
  data?: T
  error?: string
  status: number
}

interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
  } | null
  session: {
    access_token: string
    refresh_token: string
  } | null
}

interface ChatMessage {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  created_at: string
}

class EdgeFunctions {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1"
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<EdgeFunctionResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          ...options.headers,
        },
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error || "Unknown error",
        status: response.status,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Network error",
        status: 500,
      }
    }
  }

  async getCurrentUser(token: string): Promise<EdgeFunctionResponse<AuthResponse>> {
    return this.makeRequest<AuthResponse>("auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async sendMessage(content: string, recipientId: string, token: string): Promise<EdgeFunctionResponse<ChatMessage>> {
    return this.makeRequest<ChatMessage>("chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content,
        recipient_id: recipientId,
      }),
    })
  }

  async getMessages(conversationId: string, token: string): Promise<EdgeFunctionResponse<ChatMessage[]>> {
    return this.makeRequest<ChatMessage[]>(`chat/${conversationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }
}

export const authFunctions = {
  getCurrentUser: (token: string) => new EdgeFunctions().getCurrentUser(token),
}

export const chatFunctions = {
  sendMessage: (content: string, recipientId: string, token: string) =>
    new EdgeFunctions().sendMessage(content, recipientId, token),
  getMessages: (conversationId: string, token: string) => new EdgeFunctions().getMessages(conversationId, token),
}

export const getCurrentUserToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("supabase.auth.token")
}

export default new EdgeFunctions()
