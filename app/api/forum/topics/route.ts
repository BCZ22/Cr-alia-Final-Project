/**
 * GET /api/forum/topics
 * POST /api/forum/topics
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getForumTopics, createForumTopic } from '@/lib/forum/forum-service'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET - List forum topics
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const result = await getForumTopics({
      category,
      search,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get forum topics error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get forum topics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Create new topic
 */
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
    const { title, content, category } = body

    // Create topic
    const topic = await createForumTopic({
      userId: session.user.id,
      title,
      content,
      category,
    })

    return NextResponse.json({
      topic: {
        id: topic.id,
        title: topic.title,
        content: topic.content,
        category: topic.category,
        createdAt: topic.createdAt,
        user: topic.user,
      },
    })
  } catch (error) {
    console.error('Create forum topic error:', error)

    return NextResponse.json(
      {
        error: 'Failed to create forum topic',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

