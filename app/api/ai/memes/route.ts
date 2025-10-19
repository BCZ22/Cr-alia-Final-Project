/**
 * POST /api/ai/memes
 * Generate memes with AI
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
    const { template, topText, bottomText, style } = body

    // Validate input
    if (!template) {
      return NextResponse.json(
        { error: 'Template is required' },
        { status: 400 }
      )
    }

    // Create job
    const job = await createStudioJob({
      userId: session.user.id,
      type: 'MEME_GENERATE',
      inputData: {
        template,
        topText: topText || '',
        bottomText: bottomText || '',
        style: style || 'classic',
      },
    })

    // Mock mode: return sample meme
    const mockMeme = {
      imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`,
      template,
      topText,
      bottomText,
    }

    await mockCompleteJob(job.id, mockMeme)

    return NextResponse.json({
      jobId: job.id,
      status: 'COMPLETED',
      meme: mockMeme,
      message: 'Meme generated (mock mode)',
    })
  } catch (error) {
    console.error('Meme generation error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate meme',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

