/**
 * POST /api/billing/portal
 * Create Stripe customer portal session for managing subscription
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createCustomerPortalSession } from '@/lib/stripe'
import { PaymentRepository } from '@/lib/db/repositories'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's active subscription
    const payment = await PaymentRepository.getActiveSubscription(session.user.id)

    if (!payment || !payment.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    // Get app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create portal session
    const portalSession = await createCustomerPortalSession(
      payment.stripeCustomerId,
      `${appUrl}/account`
    )

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error) {
    console.error('Failed to create portal session:', error)

    return NextResponse.json(
      {
        error: 'Failed to create portal session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

