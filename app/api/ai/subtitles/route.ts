/**
 * POST /api/ai/subtitles
 * Generate subtitles for video with AI (Whisper)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createStudioJob, mockCompleteJob } from '@/lib/studio/job-service'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse body
    const body = await req.json()
    const { videoUrl, language } = body

    // Validate input
    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      )
    }

    // Create job
    const job = await createStudioJob({
      userId: session.user.id,
      type: 'SUBTITLE_GENERATE',
      inputData: {
        videoUrl,
        language: language || 'fr',
      },
    })

    // Mock mode: return sample subtitles
    const mockSubtitles = [
      { start: 0, end: 3, text: 'Bienvenue sur Créalia !' },
      { start: 3, end: 7, text: 'La plateforme de création de contenu viral.' },
      { start: 7, end: 12, text: 'Créez des Reels incroyables en quelques clics.' },
    ]

    await mockCompleteJob(job.id, { subtitles: mockSubtitles })

    return NextResponse.json({
      jobId: job.id,
      status: 'COMPLETED',
      subtitles: mockSubtitles,
      message: 'Subtitles generated (mock mode)',
    })
  } catch (error) {
    console.error('Subtitle generation error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate subtitles',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

