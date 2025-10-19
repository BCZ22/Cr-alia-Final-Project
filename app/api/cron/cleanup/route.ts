/**
 * GET /api/cron/cleanup
 * Daily cleanup cron job
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/client'
import { logger } from '@/lib/monitoring/logger'

export async function GET(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('Starting daily cleanup job')

    let cleaned = 0

    // 1. Delete expired sessions (> 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const deletedSessions = await prisma.userSession.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
      },
    })
    cleaned += deletedSessions.count

    // 2. Delete old webhook events (> 90 days)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const deletedWebhooks = await prisma.webhookEvent.deleteMany({
      where: {
        createdAt: { lt: ninetyDaysAgo },
      },
    })
    cleaned += deletedWebhooks.count

    // 3. Delete inactive chat sessions (> 7 days, not active)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const deletedChats = await prisma.chatSession.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
        isActive: false,
      },
    })
    cleaned += deletedChats.count

    // 4. Delete old failed jobs (> 7 days)
    const deletedAIJobs = await prisma.aIJob.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
        status: 'FAILED',
      },
    })
    cleaned += deletedAIJobs.count

    const deletedStudioJobs = await prisma.studioJob.deleteMany({
      where: {
        createdAt: { lt: sevenDaysAgo },
        status: 'FAILED',
      },
    })
    cleaned += deletedStudioJobs.count

    logger.info('Daily cleanup completed', { cleaned })

    return NextResponse.json({
      success: true,
      cleaned,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Cleanup cron job failed', error as Error)

    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

