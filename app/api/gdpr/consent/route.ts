/**
 * GET /api/gdpr/consent - Get consent preferences
 * POST /api/gdpr/consent - Update consent preferences
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getUserConsent, updateUserConsent } from '@/lib/gdpr/consent'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

/**
 * GET - Get user consent preferences
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get consent
    const consent = await getUserConsent(session.user.id)

    return NextResponse.json({
      consent: consent || {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      },
    })
  } catch (error) {
    console.error('Get consent error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get consent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST - Update consent preferences
 */
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
    const { analytics, marketing, preferences } = body

    // Update consent
    await updateUserConsent(session.user.id, {
      analytics: analytics === true,
      marketing: marketing === true,
      preferences: preferences === true,
    })

    return NextResponse.json({
      success: true,
      message: 'Consent preferences updated',
    })
  } catch (error) {
    console.error('Update consent error:', error)

    return NextResponse.json(
      {
        error: 'Failed to update consent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

