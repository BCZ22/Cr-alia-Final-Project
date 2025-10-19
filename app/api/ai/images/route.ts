/**
 * POST /api/ai/images
 * Generate images with AI (DALL-E, Stable Diffusion)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { openai } from '@/lib/ai/openai-client'
import { createStudioJob, mockCompleteJob } from '@/lib/studio/job-service'
import { UserRepository } from '@/lib/db/repositories'
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
    const { prompt, size, style, n } = body

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Create job
    const job = await createStudioJob({
      userId: session.user.id,
      type: 'IMAGE_GENERATE',
      inputData: {
        prompt,
        size: size || '1024x1024',
        style: style || 'vivid',
        n: n || 1,
      },
    })

    // Track usage
    await UserRepository.incrementAIImages(session.user.id)

    // Check if we should use mock mode
    const useMock = process.env.OPENAI_API_KEY === 'sk-mock-key' || 
                    process.env.AI_MOCK_MODE === 'true'

    if (useMock) {
      // Mock mode: return placeholder images
      const mockImages = Array.from({ length: n || 1 }, (_, i) => ({
        url: `https://picsum.photos/1024/1024?random=${Date.now() + i}`,
        prompt,
      }))

      await mockCompleteJob(job.id, { images: mockImages })

      return NextResponse.json({
        jobId: job.id,
        status: 'COMPLETED',
        images: mockImages,
      })
    }

    // Real mode: call OpenAI DALL-E
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: (size || '1024x1024') as any,
        quality: 'standard',
        n: 1, // DALL-E 3 only supports n=1
      })

      const images = response.data.map((img) => ({
        url: img.url,
        prompt,
      }))

      await mockCompleteJob(job.id, { images })

      return NextResponse.json({
        jobId: job.id,
        status: 'COMPLETED',
        images,
      })
    } catch (aiError) {
      console.error('OpenAI error:', aiError)
      
      return NextResponse.json(
        {
          error: 'Failed to generate images',
          details: aiError instanceof Error ? aiError.message : 'AI error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Image generation error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate images',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

