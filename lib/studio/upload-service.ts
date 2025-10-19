/**
 * Studio Upload Service
 * Handle file uploads for Créalia Studio
 */

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export interface UploadResult {
  success: boolean
  url?: string
  fileName?: string
  size?: number
  error?: string
}

/**
 * Save uploaded file to public/uploads
 */
export async function saveUploadedFile(
  file: File,
  userId: string
): Promise<UploadResult> {
  try {
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large (max 100MB)',
      }
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/quicktime',
      'audio/mpeg',
      'audio/wav',
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type',
      }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', userId)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`
    const filePath = join(uploadsDir, fileName)

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file
    await writeFile(filePath, buffer)

    // Return public URL
    const url = `/uploads/${userId}/${fileName}`

    return {
      success: true,
      url,
      fileName,
      size: file.size,
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    }
  }
}

/**
 * Get file type category
 */
export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'other'
}

