/**
 * POST /api/studio/video/compose
 * Compose/edit video with AI
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
    const { clips, transitions, music, duration } = body

    // Validate input
    if (!clips || !Array.isArray(clips) || clips.length === 0) {
      return NextResponse.json(
        { error: 'At least one clip is required' },
        { status: 400 }
      )
    }

    // Create job
    const job = await createStudioJob({
      userId: session.user.id,
      type: 'VIDEO_EDIT',
      inputData: {
        clips,
        transitions,
        music,
        duration,
      },
    })

    // In MOCK mode, complete job immediately
    if (process.env.STUDIO_MOCK_MODE === 'true') {
      const mockOutput = {
        videoUrl: '/uploads/mock-output.mp4',
        thumbnail: '/uploads/mock-thumbnail.jpg',
        duration: duration || 60,
      }

      await mockCompleteJob(job.id, mockOutput)

      return NextResponse.json({
        jobId: job.id,
        status: 'COMPLETED',
        output: mockOutput,
      })
    }

    // Return job ID for status polling
    return NextResponse.json({
      jobId: job.id,
      status: 'PROCESSING',
      message: 'Video composition started',
    })
  } catch (error) {
    console.error('Video compose error:', error)

    return NextResponse.json(
      {
        error: 'Failed to compose video',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

