import { createClient } from "./supabase-client"

export interface UploadResult {
  path: string
  url: string
  error?: string
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
  private bucketName = "pet-media"

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    try {
      const { data, error } = await this.supabase.storage.from(this.bucketName).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        return { path: "", url: "", error: error.message }
      }

      const { data: urlData } = this.supabase.storage.from(this.bucketName).getPublicUrl(data.path)

      return {
        path: data.path,
        url: urlData.publicUrl,
      }
    } catch (error) {
      return {
        path: "",
        url: "",
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async deleteFile(path: string): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.storage.from(this.bucketName).remove([path])

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

  async getPublicUrl(path: string): Promise<string> {
    const { data } = this.supabase.storage.from(this.bucketName).getPublicUrl(path)

    return data.publicUrl
  }

  async createSignedUrl(path: string, expiresIn = 3600): Promise<{ url?: string; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage.from(this.bucketName).createSignedUrl(path, expiresIn)

      if (error) {
        return { error: error.message }
      }

      return { url: data.signedUrl }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to create signed URL",
      }
    }
  }

  async listFiles(folder = ""): Promise<{ files?: StorageFile[]; error?: string }> {
    try {
      const { data, error } = await this.supabase.storage.from(this.bucketName).list(folder, {
        limit: 100,
        offset: 0,
      })

      if (error) {
        return { error: error.message }
      }

      return { files: data as StorageFile[] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to list files",
      }
    }
  }

  async moveFile(fromPath: string, toPath: string): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.storage.from(this.bucketName).move(fromPath, toPath)

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Move failed",
      }
    }
  }

  generatePath(petId: string, fileName: string, type: "photos" | "documents" | "medical" = "photos"): string {
    const timestamp = Date.now()
    const extension = fileName.split(".").pop()
    const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    return `${type}/${petId}/${timestamp}_${cleanName}`
  }
}

export const storageService = new StorageService()
export default storageService
