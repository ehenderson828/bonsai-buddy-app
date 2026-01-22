import { supabase } from "./client"

const BUCKET_NAME = "bonsai-images"

/**
 * Upload an image to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID (for organizing files)
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload file
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The full URL of the image to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split("/")
    const bucketIndex = pathParts.indexOf(BUCKET_NAME)
    const filePath = pathParts.slice(bucketIndex + 1).join("/")

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

/**
 * Validate image file
 * @param file - The file to validate
 * @returns Object with isValid boolean and optional error message
 */
export function validateImageFile(file: File): {
  isValid: boolean
  error?: string
} {
  // Check file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      error: "Image size must be less than 5MB",
    }
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    }
  }

  return { isValid: true }
}

/**
 * Upload an avatar image to Supabase Storage
 * Uses a deterministic path so old avatars are automatically replaced
 * @param file - The image file to upload
 * @param userId - The user's ID
 * @returns The public URL of the uploaded avatar
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  try {
    // Use deterministic filename so it overwrites previous avatar
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `avatars/${userId}.${fileExt}`

    // Upload file with upsert to replace existing
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // Replace existing avatar
      })

    if (error) throw error

    // Get public URL with cache-busting timestamp
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path)

    // Add timestamp to bust browser cache when avatar is updated
    return `${publicUrl}?t=${Date.now()}`
  } catch (error) {
    console.error("Error uploading avatar:", error)
    throw error
  }
}

/**
 * Compress and resize avatar for optimal storage
 * @param file - The image file to compress
 * @returns Compressed file sized appropriately for avatars
 */
export async function compressAvatar(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement("canvas")

        // Create a square crop from the center
        const size = Math.min(img.width, img.height)
        const targetSize = 400 // 400x400 is good for avatars

        canvas.width = targetSize
        canvas.height = targetSize

        const ctx = canvas.getContext("2d")

        // Calculate crop position (center of image)
        const sx = (img.width - size) / 2
        const sy = (img.height - size) / 2

        ctx?.drawImage(img, sx, sy, size, size, 0, 0, targetSize, targetSize)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error("Canvas to Blob conversion failed"))
            }
          },
          "image/jpeg",
          0.9 // 90% quality for avatars
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
  })
}

/**
 * Compress and resize image before upload (optional helper)
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels
 * @returns Compressed file
 */
export async function compressImage(file: File, maxWidth = 1200): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Resize if needed
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error("Canvas to Blob conversion failed"))
            }
          },
          file.type,
          0.85 // 85% quality
        )
      }

      img.onerror = () => reject(new Error("Failed to load image"))
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
  })
}
