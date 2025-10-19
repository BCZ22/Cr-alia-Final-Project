/**
 * GET /api/chat/history?session_id=xxx
 * Get chat history for a session
 */

import { NextRequest, NextResponse } from 'next/server'
import { getChatHistory } from '@/lib/ai'

export async function GET(req: NextRequest) {
  try {
    // Get session ID from query params
    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')
    const limitParam = searchParams.get('limit')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    const limit = limitParam ? parseInt(limitParam, 10) : 50

    // Get chat history
    const messages = await getChatHistory(sessionId, limit)

    return NextResponse.json({
      sessionId,
      messages,
      count: messages.length,
    })
  } catch (error) {
    console.error('Get chat history error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get chat history',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

