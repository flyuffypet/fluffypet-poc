import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export class StorageService {
  private supabase = createClient()

  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: {
      cacheControl?: string
      contentType?: string
      upsert?: boolean
    },
  ): Promise<UploadResult> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, {
        cacheControl: options?.cacheControl || "3600",
        contentType: options?.contentType || file.type,
        upsert: options?.upsert || false,
      })

      if (error) {
        return { url: "", path: "", error: error.message }
      }

      const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
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

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        return { error: error.message }
      }

      return { url: data.signedUrl }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to get signed URL",
      }
    }
  }

  async listFiles(bucket: string, path?: string): Promise<{ files?: any[]; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).list(path)

      if (error) {
        return { error: error.message }
      }

      return { files: data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to list files",
      }
    }
  }
}

export const storageService = new StorageService()
