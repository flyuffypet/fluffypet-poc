import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export class SupabaseStorageService {
  private supabase = createClientComponentClient()

  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: {
      cacheControl?: string
      contentType?: string
      upsert?: boolean
    },
  ) {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).upload(path, file, {
        cacheControl: options?.cacheControl || "3600",
        contentType: options?.contentType || file.type,
        upsert: options?.upsert || false,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        throw error
      }

      return data.signedUrl
    } catch (error) {
      console.error("Error creating signed URL:", error)
      throw error
    }
  }

  async deleteFile(bucket: string, paths: string[]) {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).remove(paths)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error deleting file:", error)
      throw error
    }
  }

  async listFiles(bucket: string, path?: string) {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).list(path)

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error listing files:", error)
      throw error
    }
  }

  getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }
}

export const storageService = new SupabaseStorageService()
