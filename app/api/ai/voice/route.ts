/**
 * POST /api/ai/voice
 * Generate voice-over with AI (OpenAI TTS)
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
    const { text, voice, speed } = body

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (text.length > 4096) {
      return NextResponse.json(
        { error: 'Text too long (max 4096 characters)' },
        { status: 400 }
      )
    }

    // Create job
    const job = await createStudioJob({
      userId: session.user.id,
      type: 'VOICE_GENERATE',
      inputData: {
        text,
        voice: voice || 'alloy',
        speed: speed || 1.0,
      },
    })

    // Track usage
    await UserRepository.incrementVoiceMinutes(session.user.id, Math.ceil(text.length / 1000))

    // Check if we should use mock mode
    const useMock = process.env.OPENAI_API_KEY === 'sk-mock-key' || 
                    process.env.AI_MOCK_MODE === 'true'

    if (useMock) {
      // Mock mode: return placeholder audio
      const mockOutput = {
        audioUrl: '/uploads/mock-voice.mp3',
        duration: Math.ceil(text.length / 15), // ~15 chars per second
        text,
        voice: voice || 'alloy',
      }

      await mockCompleteJob(job.id, mockOutput)

      return NextResponse.json({
        jobId: job.id,
        status: 'COMPLETED',
        output: mockOutput,
      })
    }

    // Real mode: call OpenAI TTS
    try {
      const response = await openai.audio.speech.create({
        model: 'tts-1',
        voice: (voice || 'alloy') as any,
        input: text,
        speed: speed || 1.0,
      })

      // In production, you would save this to storage
      // For now, return a mock URL
      const output = {
        audioUrl: '/uploads/generated-voice.mp3',
        duration: Math.ceil(text.length / 15),
        text,
        voice: voice || 'alloy',
      }

      await mockCompleteJob(job.id, output)

      return NextResponse.json({
        jobId: job.id,
        status: 'COMPLETED',
        output,
        message: 'Audio generated successfully. In production, this would be saved to storage.',
      })
    } catch (aiError) {
      console.error('OpenAI error:', aiError)
      
      return NextResponse.json(
        {
          error: 'Failed to generate voice',
          details: aiError instanceof Error ? aiError.message : 'AI error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Voice generation error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate voice',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

