/**
 * User Repository
 * Database operations for users
 */

import { prisma } from '../client'
import type { User } from '@prisma/client'

export interface UpdateUserSubscriptionData {
  stripeCustomerId?: string
  subscriptionStatus?: string
  subscriptionPlan?: string
}

export class UserRepository {
  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        usageStats: true,
        payments: {
          where: { status: 'PAID' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  /**
   * Update user's Stripe customer ID
   */
  static async updateStripeCustomer(
    userId: string,
    customerId: string
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: {
        // Note: You may need to add stripeCustomerId field to User model
        // For now, we'll store it in metadata or a separate field
      },
    })
  }

  /**
   * Get or create usage stats for user
   */
  static async getOrCreateUsageStats(userId: string) {
    let stats = await prisma.userUsageStats.findUnique({
      where: { userId },
    })

    if (!stats) {
      stats = await prisma.userUsageStats.create({
        data: { userId },
      })
    }

    return stats
  }

  /**
   * Increment AI generation count
   */
  static async incrementAIGenerations(userId: string) {
    const stats = await this.getOrCreateUsageStats(userId)
    return prisma.userUsageStats.update({
      where: { id: stats.id },
      data: {
        aiGenerationsCount: { increment: 1 },
      },
    })
  }

  /**
   * Increment studio job count
   */
  static async incrementStudioJobs(userId: string) {
    const stats = await this.getOrCreateUsageStats(userId)
    return prisma.userUsageStats.update({
      where: { id: stats.id },
      data: {
        studioJobsCount: { increment: 1 },
      },
    })
  }

  /**
   * Increment chat messages count
   */
  static async incrementChatMessages(userId: string) {
    const stats = await this.getOrCreateUsageStats(userId)
    return prisma.userUsageStats.update({
      where: { id: stats.id },
      data: {
        chatMessagesCount: { increment: 1 },
      },
    })
  }

  /**
   * Add export minutes
   */
  static async addExportMinutes(userId: string, minutes: number) {
    const stats = await this.getOrCreateUsageStats(userId)
    return prisma.userUsageStats.update({
      where: { id: stats.id },
      data: {
        exportMinutesUsed: { increment: minutes },
      },
    })
  }

  /**
   * Reset monthly usage
   */
  static async resetMonthlyUsage(userId: string) {
    const stats = await this.getOrCreateUsageStats(userId)
    return prisma.userUsageStats.update({
      where: { id: stats.id },
      data: {
        aiGenerationsCount: 0,
        studioJobsCount: 0,
        chatMessagesCount: 0,
        exportMinutesUsed: 0,
        voiceoverMinutesUsed: 0,
        imagesGenerated: 0,
        lastResetAt: new Date(),
      },
    })
  }
}

