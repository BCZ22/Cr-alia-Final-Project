/**
 * GET /api/crealia/jobs/[jobId]
 * Get job status and results
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Access the job store from generate route
// In production, this would be Redis or database
const getJobStore = () => {
  // This is a simplified version - in real app, use shared storage
  if (!(global as any).crealiaJobStore) {
    (global as any).crealiaJobStore = new Map()
  }
  return (global as any).crealiaJobStore
}

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { jobId } = params

    // Get job from store
    const jobStore = getJobStore()
    const job = jobStore.get(jobId)

    if (!job) {
      // Check if in MOCK mode and generate a mock job
      if (process.env.CREALIA_MOCK === 'true') {
        return NextResponse.json({
          job_id: jobId,
          status: 'success',
          progress: 100,
          logs: ['Job completé (MOCK)'],
          outputs: [
            {
              id: 'mock_output_1',
              type: 'reel',
              url: '/uploads/mock-reel.mp4',
              thumbnail: '/uploads/mock-reel-thumb.jpg',
              meta: {
                duration: 30,
                aspect_ratio: '9:16',
                format: 'mp4',
                size: 5242880,
              },
              caption: {
                title: 'Incroyable transformation ! 🔥',
                text: 'Découvrez comment créer des Reels viraux en quelques clics avec Créalia Studio.',
                hashtags: ['#crealia', '#reels', '#viral', '#ai', '#contentcreation'],
              },
            },
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }

      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (job.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Return job status
    return NextResponse.json(job)

  } catch (error) {
    console.error('[Créalia Studio] Job status error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get job status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/crealia/jobs/[jobId]
 * Cancel a running job
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { jobId } = params

    // Get job from store
    const jobStore = getJobStore()
    const job = jobStore.get(jobId)

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (job.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Cancel job
    job.status = 'failed'
    job.error = 'Cancelled by user'
    job.updated_at = new Date().toISOString()
    jobStore.set(jobId, job)

    console.log(`[Créalia Studio] Job cancelled: ${jobId}`)

    return NextResponse.json({
      success: true,
      message: 'Job cancelled',
    })

  } catch (error) {
    console.error('[Créalia Studio] Job cancel error:', error)

    return NextResponse.json(
      {
        error: 'Failed to cancel job',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

