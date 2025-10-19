/**
 * POST /api/chat/create-session
 * Create a new chat session
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createChatSession } from '@/lib/ai'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user (optional for chat)
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    // Parse body
    const body = await req.json().catch(() => ({}))
    const { initialMessage } = body

    // Create chat session
    const chatResponse = await createChatSession({
      userId,
      initialMessage,
    })

    if (!chatResponse) {
      return NextResponse.json(
        { error: 'Failed to create chat session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sessionId: chatResponse.sessionId,
      message: {
        id: chatResponse.messageId,
        role: chatResponse.role,
        content: chatResponse.content,
      },
    })
  } catch (error) {
    console.error('Create chat session error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create chat session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

