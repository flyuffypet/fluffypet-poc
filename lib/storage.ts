import { createClient } from "@/lib/supabase-client"

export class StorageService {
  private supabase = createClient()

  async uploadFile(file: File, bucket = "pet-media", folder?: string) {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, file)

      if (error) throw error

      return { data, path: filePath }
    } catch (error) {
      console.error("Upload error:", error)
      throw error
    }
  }

  async getSignedUrl(path: string, bucket = "pet-media", expiresIn = 3600) {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) throw error
      return data.signedUrl
    } catch (error) {
      console.error("Signed URL error:", error)
      throw error
    }
  }

  async deleteFile(path: string, bucket = "pet-media") {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      if (error) throw error
      return true
    } catch (error) {
      console.error("Delete error:", error)
      throw error
    }
  }
}

export const storageService = new StorageService()
