/**
 * POST /api/chat/message
 * Send a message to the chat
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { sendChatMessage, sendMockChatMessage } from '@/lib/ai'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { rateLimiter, RateLimitConfigs } from '@/lib/security/rate-limiter'
import { sanitizeChatMessage } from '@/lib/security/sanitizer'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user (optional for chat)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimitKey = userId ? `chat:user:${userId}` : `chat:ip:${ip}`
    
    if (!rateLimiter.check(rateLimitKey, RateLimitConfigs.API_AI)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse body
    const body = await req.json()
    const { sessionId, message } = body

    // Validate inputs
    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, message' },
        { status: 400 }
      )
    }

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message must be a non-empty string' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long (max 2000 characters)' },
        { status: 400 }
      )
    }

    // Sanitize message
    const sanitizedMessage = sanitizeChatMessage(message)

    // Check if we should use mock mode
    const useMock = process.env.OPENAI_API_KEY === 'sk-mock-key' || 
                    process.env.CHAT_MOCK_MODE === 'true' ||
                    !process.env.OPENAI_API_KEY

    // Send message
    const chatResponse = useMock
      ? await sendMockChatMessage({ sessionId, message: sanitizedMessage, userId })
      : await sendChatMessage({ sessionId, message: sanitizedMessage, userId })

    return NextResponse.json({
      message: {
        id: chatResponse.messageId,
        role: chatResponse.role,
        content: chatResponse.content,
      },
    })
  } catch (error) {
    console.error('Send chat message error:', error)

    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

