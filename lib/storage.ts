import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  data: {
    path: string
    fullPath: string
    publicUrl: string
  } | null
  error: string | null
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
    file: File | Buffer,
    options?: {
      cacheControl?: string
      contentType?: string
      upsert?: boolean
    },
  ): Promise<UploadResult> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, {
        cacheControl: options?.cacheControl || "3600",
        contentType: options?.contentType,
        upsert: options?.upsert || false,
      })

      if (error) {
        return { data: null, error: error.message }
      }

      const publicUrl = this.getPublicUrl(bucket, data.path)

      return {
        data: {
          path: data.path,
          fullPath: data.fullPath,
          publicUrl,
        },
        error: null,
      }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async deleteFile(bucket: string, paths: string[]): Promise<{ error: string | null }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove(paths)

      if (error) {
        return { error: error.message }
      }

      return { error: null }
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

  async getSignedUrl(
    bucket: string,
    path: string,
    expiresIn = 3600,
  ): Promise<{ signedUrl: string | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        return { signedUrl: null, error: error.message }
      }

      return { signedUrl: data.signedUrl, error: null }
    } catch (error) {
      return {
        signedUrl: null,
        error: error instanceof Error ? error.message : "Failed to create signed URL",
      }
    }
  }

  async listFiles(bucket: string, path?: string): Promise<{ files: StorageFile[] | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).list(path)

      if (error) {
        return { files: null, error: error.message }
      }

      return { files: data as StorageFile[], error: null }
    } catch (error) {
      return {
        files: null,
        error: error instanceof Error ? error.message : "Failed to list files",
      }
    }
  }

  async downloadFile(bucket: string, path: string): Promise<{ data: Blob | null; error: string | null }> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).download(path)

      if (error) {
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Download failed",
      }
    }
  }
}

export const storageService = new StorageService()
export default storageService
