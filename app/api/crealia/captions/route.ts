/**
 * POST /api/crealia/captions
 * Generate captions/subtitles for video
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse body
    const body = await req.json()
    const { media_id, lang, format } = body

    if (!media_id) {
      return NextResponse.json(
        { error: 'media_id is required' },
        { status: 400 }
      )
    }

    // In MOCK mode, return sample subtitles
    if (process.env.CREALIA_MOCK === 'true') {
      const mockSubtitles = [
        { start: 0, end: 3, text: 'Bienvenue sur Créalia Studio !' },
        { start: 3, end: 7, text: 'La plateforme de création de contenu viral.' },
        { start: 7, end: 12, text: 'Créez des Reels incroyables en quelques clics.' },
        { start: 12, end: 16, text: 'Notre IA analyse votre vidéo automatiquement.' },
        { start: 16, end: 20, text: 'Générez jusqu\'à 3 Reels optimisés.' },
        { start: 20, end: 25, text: 'Avec sous-titres, musique et branding.' },
        { start: 25, end: 30, text: 'Rejoignez-nous dès aujourd\'hui !' },
      ]

      const mockTranscript = mockSubtitles.map((s) => s.text).join(' ')

      console.log(`[Créalia Studio] Captions generated (MOCK): ${media_id}`)

      return NextResponse.json({
        status: 'success',
        subtitles_url: `/uploads/captions/${media_id}.srt`,
        transcript: mockTranscript,
        subtitles: mockSubtitles,
      })
    }

    // Production mode would use Whisper API or similar
    return NextResponse.json({
      status: 'success',
      message: 'Captions service not yet implemented in production mode',
      subtitles: [],
    })

  } catch (error) {
    console.error('[Créalia Studio] Captions error:', error)

    return NextResponse.json(
      {
        status: 'error',
        error: 'Captions generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/crealia/captions
 * Get captions endpoint information
 */
export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/crealia/captions',
    description: 'Generate captions/subtitles for video',
    authentication: 'required',
    requestBody: {
      media_id: 'string (required) - Media identifier',
      lang: 'string (optional) - Language code (default: fr)',
      format: 'string (optional) - srt | vtt | json (default: json)',
    },
    response: {
      status: 'success | error',
      subtitles_url: 'string - URL to subtitles file',
      transcript: 'string - Full transcript text',
      subtitles: [
        {
          start: 'number - Start time in seconds',
          end: 'number - End time in seconds',
          text: 'string - Subtitle text',
        },
      ],
    },
    mockMode: process.env.CREALIA_MOCK === 'true',
  })
}

