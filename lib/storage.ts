import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface UploadOptions {
  bucket?: string
  folder?: string
  maxSize?: number
  allowedTypes?: string[]
}

export class StorageService {
  private supabase = createClient()
  private defaultBucket = "media"

  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      const {
        bucket = this.defaultBucket,
        folder = "uploads",
        maxSize = 10 * 1024 * 1024, // 10MB
        allowedTypes = ["image/*", "application/pdf", "text/*"],
      } = options

      // Validate file size
      if (file.size > maxSize) {
        return { url: "", path: "", error: "File too large" }
      }

      // Validate file type
      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.slice(0, -1))
        }
        return file.type === type
      })

      if (!isAllowed) {
        return { url: "", path: "", error: "File type not allowed" }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2)
      const extension = file.name.split(".").pop()
      const filename = `${timestamp}_${randomString}.${extension}`
      const path = `${folder}/${filename}`

      // Upload file
      const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) {
        console.error("Upload error:", error)
        return { url: "", path: "", error: error.message }
      }

      // Get public URL
      const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(data.path)

      return {
        url: urlData.publicUrl,
        path: data.path,
      }
    } catch (error) {
      console.error("Storage service error:", error)
      return {
        url: "",
        path: "",
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async deleteFile(path: string, bucket = this.defaultBucket): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove([path])

      if (error) {
        console.error("Delete error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Delete service error:", error)
      return false
    }
  }

  async getSignedUrl(path: string, expiresIn = 3600, bucket = this.defaultBucket): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        console.error("Signed URL error:", error)
        return null
      }

      return data.signedUrl
    } catch (error) {
      console.error("Signed URL service error:", error)
      return null
    }
  }

  getPublicUrl(path: string, bucket = this.defaultBucket): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }
}

export const storageService = new StorageService()
