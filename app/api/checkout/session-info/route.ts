export const dynamic = 'force-dynamic';

/**
 * GET /api/checkout/session-info?session_id=xxx
 * Get checkout session details after successful payment
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { getCheckoutSession } from '@/lib/stripe'
import { PaymentRepository } from '@/lib/db/repositories'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get session ID from query params
    const searchParams = req.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    // Get Stripe session
    const stripeSession = await getCheckoutSession(sessionId)

    // Get payment from database
    const payment = await PaymentRepository.findByStripeSessionId(sessionId)

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Verify payment belongs to user
    if (payment.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      payment: {
        id: payment.id,
        planId: payment.planId,
        planName: payment.planName,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        billingCycle: payment.billingCycle,
        createdAt: payment.createdAt,
      },
      subscription: {
        id: stripeSession.subscription,
        status: (stripeSession.subscription as any)?.status,
        currentPeriodEnd: (stripeSession.subscription as any)?.current_period_end,
      },
      customer: {
        email: (stripeSession.customer as any)?.email || stripeSession.customer_email,
      },
    })
  } catch (error) {
    console.error('Failed to get session info:', error)

    return NextResponse.json(
      {
        error: 'Failed to get session info',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

