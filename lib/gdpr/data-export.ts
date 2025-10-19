/**
 * GDPR Data Export
 * Export all user data
 */

import { prisma } from '@/lib/db/client'

export interface UserDataExport {
  user: any
  payments: any[]
  chatSessions: any[]
  forumTopics: any[]
  forumComments: any[]
  aiJobs: any[]
  studioJobs: any[]
  usageStats: any
  exportDate: string
}

/**
 * Export all user data (GDPR right to data portability)
 */
export async function exportUserData(userId: string): Promise<UserDataExport> {
  try {
    // Fetch all user data
    const [
      user,
      payments,
      chatSessions,
      forumTopics,
      forumComments,
      aiJobs,
      studioJobs,
      usageStats,
    ] = await Promise.all([
      // User profile
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          stripeCustomerId: true,
          consentData: true,
          consentDate: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      // Payments
      prisma.payment.findMany({
        where: { userId },
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          paymentMethod: true,
          planId: true,
          billingCycle: true,
          createdAt: true,
        },
      }),

      // Chat sessions
      prisma.chatSession.findMany({
        where: { userId },
        include: {
          messages: {
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          },
        },
      }),

      // Forum topics
      prisma.forumTopic.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          content: true,
          category: true,
          views: true,
          isPinned: true,
          isLocked: true,
          createdAt: true,
        },
      }),

      // Forum comments
      prisma.forumComment.findMany({
        where: { userId },
        select: {
          id: true,
          content: true,
          topicId: true,
          createdAt: true,
        },
      }),

      // AI jobs
      prisma.aIJob.findMany({
        where: { userId },
        select: {
          id: true,
          jobType: true,
          status: true,
          inputData: true,
          outputData: true,
          createdAt: true,
          completedAt: true,
        },
      }),

      // Studio jobs
      prisma.studioJob.findMany({
        where: { userId },
        select: {
          id: true,
          jobType: true,
          status: true,
          inputData: true,
          outputData: true,
          createdAt: true,
          completedAt: true,
        },
      }),

      // Usage stats
      prisma.userUsageStats.findUnique({
        where: { userId },
      }),
    ])

    return {
      user,
      payments,
      chatSessions,
      forumTopics,
      forumComments,
      aiJobs,
      studioJobs,
      usageStats,
      exportDate: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Failed to export user data:', error)
    throw new Error('Failed to export user data')
  }
}

