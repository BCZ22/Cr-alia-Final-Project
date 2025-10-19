/**
 * POST /api/gdpr/export
 * Export all user data (GDPR)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { exportUserData } from '@/lib/gdpr/data-export'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { logger } from '@/lib/monitoring/logger'

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

    // Export data
    logger.info('GDPR data export requested', { userId: session.user.id })
    
    const data = await exportUserData(session.user.id)

    // Return as JSON download
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="crealia-data-export-${session.user.id}-${Date.now()}.json"`,
      },
    })
  } catch (error) {
    console.error('GDPR export error:', error)

    return NextResponse.json(
      {
        error: 'Failed to export data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

