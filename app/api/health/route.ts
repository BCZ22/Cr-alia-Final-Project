/**
 * GET /api/health
 * Health check endpoint
 */

import { NextRequest, NextResponse } from 'next/server'
import { performHealthCheck } from '@/lib/monitoring/health'

export async function GET(req: NextRequest) {
  try {
    const health = await performHealthCheck()

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    console.error('Health check error:', error)

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

