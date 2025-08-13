import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface StorageService {
  uploadFile: (file: File, bucket?: string, folder?: string) => Promise<UploadResult>
  deleteFile: (path: string, bucket?: string) => Promise<{ error?: string }>
  getPublicUrl: (path: string, bucket?: string) => string
  getSignedUrl: (path: string, expiresIn?: number, bucket?: string) => Promise<{ signedUrl?: string; error?: string }>
}

class SupabaseStorageService implements StorageService {
  private supabase = createClient()

  async uploadFile(file: File, bucket = "pet-media", folder = "general"): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await this.supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        return { url: "", path: "", error: error.message }
      }

      const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
      }
    } catch (error: any) {
      return { url: "", path: "", error: error.message }
    }
  }

  async deleteFile(path: string, bucket = "pet-media"): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error: any) {
      return { error: error.message }
    }
  }

  getPublicUrl(path: string, bucket = "pet-media"): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async getSignedUrl(
    path: string,
    expiresIn = 3600,
    bucket = "pet-media",
  ): Promise<{ signedUrl?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        return { error: error.message }
      }

      return { signedUrl: data.signedUrl }
    } catch (error: any) {
      return { error: error.message }
    }
  }
}

export const storageService = new SupabaseStorageService()
export default storageService
