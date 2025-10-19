/**
 * GET /api/chat/sessions
 * Get user's chat sessions
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getUserChatSessions } from '@/lib/ai'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's chat sessions
    const sessions = await getUserChatSessions(session.user.id)

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        createdAt: s.createdAt,
        isActive: s.isActive,
        messageCount: s.messages?.length || 0,
        preview: s.messages?.[0]?.content?.substring(0, 100) || '',
      })),
      count: sessions.length,
    })
  } catch (error) {
    console.error('Get chat sessions error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get chat sessions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

