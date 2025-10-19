/**
 * GET /api/forum/topics/:id
 * DELETE /api/forum/topics/:id
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getForumTopic, deleteForumTopic } from '@/lib/forum/forum-service'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET - Get single topic with comments
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const topic = await getForumTopic(params.id)

    return NextResponse.json({ topic })
  } catch (error) {
    console.error('Get forum topic error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get forum topic',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: error instanceof Error && error.message === 'Topic not found' ? 404 : 500 }
    )
  }
}

/**
 * DELETE - Delete topic
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete topic
    await deleteForumTopic(params.id, session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete forum topic error:', error)

    return NextResponse.json(
      {
        error: 'Failed to delete forum topic',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
    )
  }
}

