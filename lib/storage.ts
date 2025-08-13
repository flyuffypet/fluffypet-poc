"use client"

export interface UploadOptions {
  bucket?: string
  path?: string
  maxSize?: number
  allowedTypes?: string[]
}

export interface UploadResult {
  url: string
  path: string
  error?: string
}

class StorageService {
  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResult> {
    try {
      // Validate file size
      if (options.maxSize && file.size > options.maxSize) {
        return {
          url: "",
          path: "",
          error: `File size exceeds ${Math.round(options.maxSize / 1024 / 1024)}MB limit`,
        }
      }

      // Validate file type
      if (options.allowedTypes && !options.allowedTypes.some((type) => file.type.startsWith(type))) {
        return {
          url: "",
          path: "",
          error: "File type not allowed",
        }
      }

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create mock URL and path
      const mockUrl = URL.createObjectURL(file)
      const mockPath = `${options.bucket || "default"}/${options.path || ""}/${Date.now()}-${file.name}`

      return {
        url: mockUrl,
        path: mockPath,
      }
    } catch (error) {
      return {
        url: "",
        path: "",
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  async deleteFile(path: string): Promise<{ error?: string }> {
    try {
      // Simulate delete delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {}
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Delete failed",
      }
    }
  }

  getPublicUrl(path: string): string {
    // Return mock public URL
    return `/api/storage/${path}`
  }
}

export const storageService = new StorageService()
