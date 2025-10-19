/**
 * Payment Repository
 * Database operations for payments and subscriptions
 */

import { prisma } from '../client'
import type { Payment, PaymentStatus } from '@prisma/client'

export interface CreatePaymentData {
  userId: string
  stripeCustomerId?: string
  stripeSessionId?: string
  stripeSubscriptionId?: string
  stripePaymentIntentId?: string
  planId: string
  planName: string
  amount: number
  currency?: string
  billingCycle?: string
  metadata?: any
}

export interface UpdatePaymentData {
  status?: PaymentStatus
  stripeSubscriptionId?: string
  stripePaymentIntentId?: string
  metadata?: any
}

export class PaymentRepository {
  /**
   * Create a new payment record
   */
  static async create(data: CreatePaymentData): Promise<Payment> {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        stripeCustomerId: data.stripeCustomerId,
        stripeSessionId: data.stripeSessionId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripePaymentIntentId: data.stripePaymentIntentId,
        planId: data.planId,
        planName: data.planName,
        status: 'PENDING',
        amount: data.amount,
        currency: data.currency || 'usd',
        billingCycle: data.billingCycle || 'monthly',
        metadata: data.metadata,
      },
    })
  }

  /**
   * Get payment by ID
   */
  static async findById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })
  }

  /**
   * Get payment by Stripe session ID
   */
  static async findByStripeSessionId(sessionId: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
      include: {
        user: true,
      },
    })
  }

  /**
   * Get all payments for a user
   */
  static async findByUserId(userId: string, limit = 10): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  /**
   * Update payment
   */
  static async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data,
    })
  }

  /**
   * Mark payment as paid
   */
  static async markAsPaid(id: string, subscriptionId?: string): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        status: 'PAID',
        stripeSubscriptionId: subscriptionId,
      },
    })
  }

  /**
   * Mark payment as failed
   */
  static async markAsFailed(id: string, error?: string): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data: {
        status: 'FAILED',
        metadata: error ? { error } : undefined,
      },
    })
  }

  /**
   * Get active subscription for user
   */
  static async getActiveSubscription(userId: string): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: {
        userId,
        status: 'PAID',
        stripeSubscriptionId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}

