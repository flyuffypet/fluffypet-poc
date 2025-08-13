import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface StorageService {
  uploadFile(file: File, bucket: string, path?: string): Promise<UploadResult>
  deleteFile(bucket: string, path: string): Promise<{ error?: string }>
  getPublicUrl(bucket: string, path: string): string
  getSignedUrl(bucket: string, path: string, expiresIn?: number): Promise<{ url: string; error?: string }>
}

class SupabaseStorageService implements StorageService {
  private supabase = createClient()

  async uploadFile(file: File, bucket: string, path?: string): Promise<UploadResult> {
    try {
      const fileName = path || `${Date.now()}-${file.name}`
      const filePath = `uploads/${fileName}`

      const { data, error } = await this.supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        return { url: "", path: "", error: error.message }
      }

      const publicUrl = this.getPublicUrl(bucket, data.path)

      return {
        url: publicUrl,
        path: data.path,
      }
    } catch (error) {
      return {
        url: "",
        path: "",
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async deleteFile(bucket: string, path: string): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Delete failed",
      }
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<{ url: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        return { url: "", error: error.message }
      }

      return { url: data.signedUrl }
    } catch (error) {
      return {
        url: "",
        error: error instanceof Error ? error.message : "Failed to create signed URL",
      }
    }
  }
}

export const storageService = new SupabaseStorageService()
export default storageService
