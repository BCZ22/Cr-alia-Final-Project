/**
 * Chat Repository
 * Database operations for chat sessions and messages
 */

import { prisma } from '../client'
import type { ChatSession, ChatMessage, ChatMessageRole } from '@prisma/client'

export interface CreateChatSessionData {
  userId?: string
  sessionToken?: string
  context?: any
  metadata?: any
}

export interface CreateChatMessageData {
  chatSessionId: string
  role: ChatMessageRole
  content: string
  metadata?: any
}

export class ChatRepository {
  /**
   * Create a new chat session
   */
  static async createSession(data: CreateChatSessionData): Promise<ChatSession> {
    return prisma.chatSession.create({
      data: {
        userId: data.userId,
        sessionToken: data.sessionToken || crypto.randomUUID(),
        context: data.context,
        metadata: data.metadata,
      },
    })
  }

  /**
   * Get chat session by ID
   */
  static async findSessionById(id: string): Promise<ChatSession | null> {
    return prisma.chatSession.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  /**
   * Get chat session by token
   */
  static async findSessionByToken(token: string): Promise<ChatSession | null> {
    return prisma.chatSession.findUnique({
      where: { sessionToken: token },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  }

  /**
   * Get active sessions for user
   */
  static async findActiveSessionsByUserId(userId: string): Promise<ChatSession[]> {
    return prisma.chatSession.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  }

  /**
   * Create a chat message
   */
  static async createMessage(data: CreateChatMessageData): Promise<ChatMessage> {
    return prisma.chatMessage.create({
      data: {
        chatSessionId: data.chatSessionId,
        role: data.role,
        content: data.content,
        metadata: data.metadata,
      },
    })
  }

  /**
   * Get messages for a session
   */
  static async getMessages(
    sessionId: string,
    limit = 100,
    offset = 0
  ): Promise<ChatMessage[]> {
    return prisma.chatMessage.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset,
    })
  }

  /**
   * End a chat session
   */
  static async endSession(sessionId: string): Promise<ChatSession> {
    return prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    })
  }

  /**
   * Update session context
   */
  static async updateSessionContext(
    sessionId: string,
    context: any
  ): Promise<ChatSession> {
    return prisma.chatSession.update({
      where: { id: sessionId },
      data: { context },
    })
  }

  /**
   * Get chat history for user
   */
  static async getChatHistory(userId: string, limit = 50): Promise<ChatSession[]> {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        messages: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }
}

