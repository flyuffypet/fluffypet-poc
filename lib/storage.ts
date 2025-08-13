import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  data: {
    path: string
    id: string
    fullPath: string
  } | null
  error: Error | null
}

export interface StorageFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    eTag: string
    size: number
    mimetype: string
    cacheControl: string
    lastModified: string
    contentLength: number
    httpStatusCode: number
  }
}

class StorageService {
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
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  async deleteFile(bucket: string, path: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }

  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600,
  ): Promise<{ signedUrl: string | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        throw error
      }

      return { signedUrl: data.signedUrl, error: null }
    } catch (error) {
      return { signedUrl: null, error: error as Error }
    }
  }

  async listFiles(
    bucket: string,
    path?: string,
  ): Promise<{
    data: StorageFile[] | null
    error: Error | null
  }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).list(path)

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}

export const storageService = new StorageService()
export default storageService
