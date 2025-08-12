import { getSupabaseClient } from "./supabase-client"

// Define storage buckets
export const STORAGE_BUCKETS = {
  PET_IMAGES: "pet-images",
  MEDICAL_RECORDS: "medical-records",
  USER_AVATARS: "user-avatars",
  ORGANIZATION_MEDIA: "organization-media",
}

// Define allowed file types
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"]

// Helper function to check file type
export const isAllowedFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type)
}

// Helper function to generate a unique file name
export const generateUniqueFileName = (file: File, prefix = ""): string => {
  const timestamp = new Date().getTime()
  const randomString = Math.random().toString(36).substring(2, 10)
  const extension = file.name.split(".").pop()
  return `${prefix}${timestamp}-${randomString}.${extension}`
}

// Upload a file to Supabase Storage
export const uploadFile = async (
  file: File,
  bucket: string,
  path = "",
  onProgress?: (progress: number) => void,
): Promise<{ path: string; url: string } | null> => {
  try {
    const supabase = getSupabaseClient()
    const fileName = path || generateUniqueFileName(file)
    const fullPath = path ? `${path}/${fileName}` : fileName

    const { data, error } = await supabase.storage.from(bucket).upload(fullPath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Error uploading file:", error)
      return null
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error("Unexpected error during file upload:", error)
    return null
  }
}

// Get a signed URL for a file (for private files)
export const getSignedUrl = async (bucket: string, path: string, expiresIn = 3600): Promise<string | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)

    if (error) {
      console.error("Error creating signed URL:", error)
      return null
    }

    return data.signedUrl
  } catch (error) {
    console.error("Unexpected error getting signed URL:", error)
    return null
  }
}

// Delete a file from storage
export const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Unexpected error deleting file:", error)
    return false
  }
}

// List files in a folder
export const listFiles = async (bucket: string, path = ""): Promise<{ name: string; url: string }[] | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).list(path)

    if (error) {
      console.error("Error listing files:", error)
      return null
    }

    // Filter out folders
    const files = data.filter((item) => !item.id.endsWith("/"))

    // Get public URLs for each file
    return files.map((file) => {
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(`${path ? `${path}/` : ""}${file.name}`)

      return {
        name: file.name,
        url: urlData.publicUrl,
      }
    })
  } catch (error) {
    console.error("Unexpected error listing files:", error)
    return null
  }
}
