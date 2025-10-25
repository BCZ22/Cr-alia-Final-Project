export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/metrics
 * Periodic metrics collection
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { logger } from '@/lib/monitoring/logger'
import { metrics } from '@/lib/monitoring/metrics'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.debug('Collecting periodic metrics')

    // Collect metrics
    const [
      totalUsers,
      activeUsers,
      totalPayments,
      activeChatSessions,
      pendingJobs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
          },
        },
      }),
      prisma.payment.count({
        where: { status: 'PAID' },
      }),
      prisma.chatSession.count({
        where: { isActive: true },
      }),
      prisma.aIJob.count({
        where: { status: 'PENDING' },
      }) + prisma.studioJob.count({
        where: { status: 'PENDING' },
      }),
    ])

    // Record metrics
    metrics.record('users.total', totalUsers)
    metrics.record('users.active_24h', activeUsers)
    metrics.record('payments.total', totalPayments)
    metrics.record('chat.active_sessions', activeChatSessions)
    metrics.record('jobs.pending', pendingJobs)

    logger.debug('Metrics collected', {
      totalUsers,
      activeUsers,
      totalPayments,
      activeChatSessions,
      pendingJobs,
    })

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        activeUsers,
        totalPayments,
        activeChatSessions,
        pendingJobs,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Metrics cron job failed', error as Error)

    return NextResponse.json(
      {
        error: 'Metrics collection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

