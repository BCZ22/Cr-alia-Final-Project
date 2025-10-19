/**
 * POST /api/gdpr/delete
 * Delete all user data (GDPR right to erasure)
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { deleteUserData } from '@/lib/gdpr/data-deletion'
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

    // Parse body
    const body = await req.json()
    const { confirmation } = body

    // Require explicit confirmation
    if (confirmation !== 'DELETE_MY_DATA') {
      return NextResponse.json(
        { error: 'Confirmation required. Send: { "confirmation": "DELETE_MY_DATA" }' },
        { status: 400 }
      )
    }

    // Delete data
    logger.warn('GDPR data deletion requested', { userId: session.user.id })
    
    await deleteUserData(session.user.id)

    logger.info('GDPR data deletion completed', { userId: session.user.id })

    return NextResponse.json({
      success: true,
      message: 'All your data has been permanently deleted',
    })
  } catch (error) {
    console.error('GDPR deletion error:', error)

    return NextResponse.json(
      {
        error: 'Failed to delete data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

