import { createClient } from "./supabase-client"

class AuthFunctions {
  private supabase = createClient()

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }

  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }

  async updatePassword(password: string, accessToken?: string) {
    try {
      const { data, error } = await this.supabase.auth.updateUser({
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }
}

class ChatFunctions {
  private supabase = createClient()

  async sendMessage(conversationId: string, content: string, senderId: string) {
    try {
      const { data, error } = await this.supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          content,
          sender_id: senderId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }

  async getMessages(conversationId: string, limit = 50) {
    try {
      const { data, error } = await this.supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(limit)

      if (error) {
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }

  async createConversation(participants: string[], type = "direct") {
    try {
      const { data, error } = await this.supabase
        .from("conversations")
        .insert({
          type,
          participants,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return { error: "An unexpected error occurred" }
    }
  }
}

export const authFunctions = new AuthFunctions()
export const chatFunctions = new ChatFunctions()

export async function getCurrentUserToken() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}
