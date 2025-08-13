import { createClient } from "@/lib/supabase-client"

export interface AuthFunctionResponse {
  user?: any
  error?: string
}

export interface ChatMessage {
  id: string
  content: string
  sender_id: string
  recipient_id: string
  created_at: string
}

export interface ChatFunctionResponse {
  messages?: ChatMessage[]
  error?: string
}

class EdgeFunctions {
  private supabase = createClient()

  async getCurrentUserToken(): Promise<string | null> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession()
      return session?.access_token || null
    } catch (error) {
      console.error("Error getting user token:", error)
      return null
    }
  }

  async callAuthFunction(functionName: string, payload: any = {}): Promise<AuthFunctionResponse> {
    try {
      const token = await this.getCurrentUserToken()
      if (!token) {
        return { error: "No authentication token available" }
      }

      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { user: data }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  async callChatFunction(functionName: string, payload: any = {}): Promise<ChatFunctionResponse> {
    try {
      const token = await this.getCurrentUserToken()
      if (!token) {
        return { error: "No authentication token available" }
      }

      const { data, error } = await this.supabase.functions.invoke(functionName, {
        body: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { messages: data }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}

const edgeFunctions = new EdgeFunctions()

export const authFunctions = {
  signUp: (payload: { email: string; password: string }) => edgeFunctions.callAuthFunction("auth", payload),
  signIn: (payload: { email: string; password: string }) => edgeFunctions.callAuthFunction("auth", payload),
  signOut: () => edgeFunctions.callAuthFunction("auth", { action: "signout" }),
  resetPassword: (payload: { email: string }) => edgeFunctions.callAuthFunction("auth", payload),
}

export const chatFunctions = {
  sendMessage: (payload: { recipient_id: string; content: string }) => edgeFunctions.callChatFunction("chat", payload),
  getMessages: (payload: { conversation_id: string }) => edgeFunctions.callChatFunction("chat", payload),
}

export const getCurrentUserToken = () => edgeFunctions.getCurrentUserToken()

export default edgeFunctions
