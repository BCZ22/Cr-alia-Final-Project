/**
 * POST /api/forum/topics/:id/comments
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createForumComment } from '@/lib/forum/forum-service'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(
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

    // Parse body
    const body = await req.json()
    const { content } = body

    // Create comment
    const comment = await createForumComment({
      topicId: params.id,
      userId: session.user.id,
      content,
    })

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: comment.user,
      },
    })
  } catch (error) {
    console.error('Create forum comment error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create comment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

