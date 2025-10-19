/**
 * GDPR Data Deletion
 * Delete all user data (right to be forgotten)
 */

import { prisma } from '@/lib/db/client'
import { logger } from '@/lib/monitoring/logger'

/**
 * Delete all user data (GDPR right to erasure)
 */
export async function deleteUserData(userId: string): Promise<void> {
  try {
    logger.info('Starting user data deletion', { userId })

    // Delete in reverse order of dependencies

    // 1. Delete usage stats
    await prisma.userUsageStats.deleteMany({
      where: { userId },
    })

    // 2. Delete studio jobs
    await prisma.studioJob.deleteMany({
      where: { userId },
    })

    // 3. Delete AI jobs
    await prisma.aIJob.deleteMany({
      where: { userId },
    })

    // 4. Delete forum comments
    await prisma.forumComment.deleteMany({
      where: { userId },
    })

    // 5. Delete forum topics
    await prisma.forumTopic.deleteMany({
      where: { userId },
    })

    // 6. Delete chat messages (via cascade)
    await prisma.chatSession.deleteMany({
      where: { userId },
    })

    // 7. Delete payments
    await prisma.payment.deleteMany({
      where: { userId },
    })

    // 8. Delete user sessions
    await prisma.userSession.deleteMany({
      where: { userId },
    })

    // 9. Delete affiliate referrals
    await prisma.affiliateReferral.deleteMany({
      where: { referredUserId: userId },
    })

    // 10. Delete affiliate account
    await prisma.affiliate.deleteMany({
      where: { userId },
    })

    // 11. Finally, delete user
    await prisma.user.delete({
      where: { id: userId },
    })

    logger.info('User data deletion completed', { userId })
  } catch (error) {
    logger.error('Failed to delete user data', error as Error, { userId })
    throw new Error('Failed to delete user data')
  }
}

/**
 * Anonymize user data (alternative to deletion)
 */
export async function anonymizeUserData(userId: string): Promise<void> {
  try {
    logger.info('Starting user data anonymization', { userId })

    // Anonymize user profile
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: `anonymized-${userId}@deleted.local`,
        name: 'Deleted User',
        avatar: null,
        stripeCustomerId: null,
        consentData: null,
      },
    })

    // Anonymize forum content
    await prisma.forumTopic.updateMany({
      where: { userId },
      data: {
        content: '[Content deleted by user]',
      },
    })

    await prisma.forumComment.updateMany({
      where: { userId },
      data: {
        content: '[Comment deleted by user]',
      },
    })

    // Delete sensitive data
    await prisma.chatSession.deleteMany({
      where: { userId },
    })

    await prisma.payment.deleteMany({
      where: { userId },
    })

    logger.info('User data anonymization completed', { userId })
  } catch (error) {
    logger.error('Failed to anonymize user data', error as Error, { userId })
    throw new Error('Failed to anonymize user data')
  }
}

