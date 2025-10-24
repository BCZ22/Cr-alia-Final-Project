/**
 * POST /api/crealia/upload
 * Upload media files to Créalia Studio
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', solution: 'Veuillez vous connecter' },
        { status: 401 }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided', solution: 'Veuillez fournir un fichier' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type',
          details: `Type reçu: ${file.type}`,
          solution: 'Utilisez MP4, MOV, WEBM pour vidéos ou JPG, PNG, WEBP pour images',
          help_url: '/help/formats',
        },
        { status: 400 }
      )
    }

    // Validate file size (2GB max)
    const maxSize = 2 * 1024 * 1024 * 1024 // 2GB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: 'File too large',
          details: `Taille: ${(file.size / 1024 / 1024).toFixed(2)}MB, Max: 2GB`,
          solution: 'Compressez votre fichier ou utilisez notre outil de conversion',
          help_url: '/help/file-size',
        },
        { status: 400 }
      )
    }

    // Create uploads directory
    const userId = session.user.id!
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'crealia', userId)
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const mediaId = `media_${timestamp}_${Math.random().toString(36).substring(7)}`
    const fileName = `${mediaId}.${ext}`
    const filePath = join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Get file metadata
    const mediaUrl = `/uploads/crealia/${userId}/${fileName}`
    
    // Extract basic metadata
    const metadata = {
      duration: file.type.startsWith('video/') ? undefined : undefined, // Would use ffprobe in production
      format: ext,
      resolution: undefined, // Would use ffprobe/sharp in production
      size: file.size,
      thumbnail: undefined, // Would generate in production
    }

    // Log event
    console.log(`[Créalia Studio] File uploaded: ${mediaId} by user ${userId}`)

    return NextResponse.json({
      status: 'success',
      media_url: mediaUrl,
      media_id: mediaId,
      metadata,
    })
  } catch (error) {
    console.error('[Créalia Studio] Upload error:', error)

    return NextResponse.json(
      {
        error: 'Upload failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        solution: 'Réessayez ou contactez le support',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/crealia/upload
 * Get upload endpoint information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/crealia/upload',
    description: 'Upload media files (video/image) to Créalia Studio',
    authentication: 'required',
    requestBody: {
      file: 'File (required) - multipart/form-data',
      project_id: 'string (optional) - Associate with project',
    },
    limits: {
      maxSize: '2GB',
      allowedFormats: {
        video: ['mp4', 'mov', 'webm'],
        image: ['jpg', 'png', 'webp'],
      },
    },
    response: {
      status: 'success | error',
      media_url: 'string - Public URL to access media',
      media_id: 'string - Unique media identifier',
      metadata: {
        duration: 'number? (video only) - Duration in seconds',
        format: 'string - File extension',
        resolution: '{ width: number, height: number }?',
        size: 'number - File size in bytes',
        thumbnail: 'string? - Thumbnail URL',
      },
    },
  })
}

