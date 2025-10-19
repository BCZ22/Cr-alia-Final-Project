/**
 * Forum Service
 * Business logic for forum operations
 */

import { prisma } from '@/lib/db/client'

export interface CreateTopicParams {
  userId: string
  title: string
  content: string
  category?: string
}

export interface CreateCommentParams {
  topicId: string
  userId: string
  content: string
}

export interface GetTopicsParams {
  category?: string
  search?: string
  limit?: number
  offset?: number
}

/**
 * Create a new forum topic
 */
export async function createForumTopic(params: CreateTopicParams) {
  const { userId, title, content, category } = params

  // Validate inputs
  if (!title || title.trim().length === 0) {
    throw new Error('Title is required')
  }

  if (title.length > 200) {
    throw new Error('Title too long (max 200 characters)')
  }

  if (!content || content.trim().length === 0) {
    throw new Error('Content is required')
  }

  if (content.length > 10000) {
    throw new Error('Content too long (max 10,000 characters)')
  }

  return prisma.forumTopic.create({
    data: {
      userId,
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
}

/**
 * Get forum topics with pagination
 */
export async function getForumTopics(params: GetTopicsParams = {}) {
  const { category, search, limit = 20, offset = 0 } = params

  const where: any = {}

  if (category) {
    where.category = category
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [topics, total] = await Promise.all([
    prisma.forumTopic.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    }),
    prisma.forumTopic.count({ where }),
  ])

  return {
    topics: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      content: topic.content,
      category: topic.category,
      isPinned: topic.isPinned,
      isLocked: topic.isLocked,
      views: topic.views,
      commentCount: topic._count.comments,
      createdAt: topic.createdAt,
      user: topic.user,
    })),
    total,
    hasMore: offset + topics.length < total,
  }
}

/**
 * Get a single topic with comments
 */
export async function getForumTopic(topicId: string) {
  // Increment view count
  await prisma.forumTopic.update({
    where: { id: topicId },
    data: { views: { increment: 1 } },
  })

  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!topic) {
    throw new Error('Topic not found')
  }

  return topic
}

/**
 * Create a comment on a topic
 */
export async function createForumComment(params: CreateCommentParams) {
  const { topicId, userId, content } = params

  // Check if topic exists and is not locked
  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
  })

  if (!topic) {
    throw new Error('Topic not found')
  }

  if (topic.isLocked) {
    throw new Error('Topic is locked')
  }

  // Validate content
  if (!content || content.trim().length === 0) {
    throw new Error('Content is required')
  }

  if (content.length > 5000) {
    throw new Error('Content too long (max 5,000 characters)')
  }

  return prisma.forumComment.create({
    data: {
      topicId,
      userId,
      content: content.trim(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
}

/**
 * Get forum categories
 */
export async function getForumCategories() {
  const categories = await prisma.forumTopic.findMany({
    select: { category: true },
    distinct: ['category'],
  })

  return categories.map((c) => c.category).filter(Boolean)
}

/**
 * Delete topic (owner or admin only)
 */
export async function deleteForumTopic(topicId: string, userId: string) {
  const topic = await prisma.forumTopic.findUnique({
    where: { id: topicId },
  })

  if (!topic) {
    throw new Error('Topic not found')
  }

  if (topic.userId !== userId) {
    throw new Error('Unauthorized')
  }

  await prisma.forumTopic.delete({
    where: { id: topicId },
  })

  return { success: true }
}

/**
 * Delete comment (owner or admin only)
 */
export async function deleteForumComment(commentId: string, userId: string) {
  const comment = await prisma.forumComment.findUnique({
    where: { id: commentId },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  if (comment.userId !== userId) {
    throw new Error('Unauthorized')
  }

  await prisma.forumComment.delete({
    where: { id: commentId },
  })

  return { success: true }
}

/**
 * Pin/unpin topic (admin only)
 */
export async function pinForumTopic(topicId: string, pinned: boolean) {
  return prisma.forumTopic.update({
    where: { id: topicId },
    data: { isPinned: pinned },
  })
}

/**
 * Lock/unlock topic (admin only)
 */
export async function lockForumTopic(topicId: string, locked: boolean) {
  return prisma.forumTopic.update({
    where: { id: topicId },
    data: { isLocked: locked },
  })
}

