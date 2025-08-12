import { createClient } from "@/lib/supabase-client"

export interface UploadResult {
  data: {
    path: string
    fullPath: string
    id: string
  } | null
  error: Error | null
}

export interface SignedUrlResult {
  data: {
    signedUrl: string
  } | null
  error: Error | null
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
        throw error
      }

      return {
        data: data
          ? {
              path: data.path,
              fullPath: data.fullPath,
              id: data.id,
            }
          : null,
        error: null,
      }
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      }
    }
  }

  async getSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<SignedUrlResult> {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

      if (error) {
        throw error
      }

      return {
        data: data ? { signedUrl: data.signedUrl } : null,
        error: null,
      }
    } catch (error) {
      return {
        data: null,
        error: error as Error,
      }
    }
  }

  async deleteFile(bucket: string, paths: string[]): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.storage.from(bucket).remove(paths)

      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async listFiles(bucket: string, path?: string) {
    try {
      const { data, error } = await this.supabase.storage.from(bucket).list(path)

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  getPublicUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }
}

export const storageService = new StorageService()

// Helper functions for common operations
export const uploadPetImage = async (petId: string, file: File) => {
  const path = `pets/${petId}/${Date.now()}-${file.name}`
  return storageService.uploadFile("pet-media", path, file)
}

export const uploadMedicalDocument = async (petId: string, file: File) => {
  const path = `medical/${petId}/${Date.now()}-${file.name}`
  return storageService.uploadFile("medical-documents", path, file)
}

export const getPetImageUrl = async (path: string) => {
  return storageService.getSignedUrl("pet-media", path)
}

export const getMedicalDocumentUrl = async (path: string) => {
  return storageService.getSignedUrl("medical-documents", path)
}
