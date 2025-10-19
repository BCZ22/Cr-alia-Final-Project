/**
 * POST /api/checkout/create-session
 * Create Stripe checkout session
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { createCheckoutSession, isValidPlanId } from '@/lib/stripe'
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

    // Parse request body
    const body = await req.json()
    const { planId, billingCycle, affiliateCode } = body

    // Validate inputs
    if (!planId || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, billingCycle' },
        { status: 400 }
      )
    }

    if (!isValidPlanId(planId)) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    if (billingCycle !== 'monthly' && billingCycle !== 'yearly') {
      return NextResponse.json(
        { error: 'Invalid billing cycle. Must be "monthly" or "yearly"' },
        { status: 400 }
      )
    }

    // Get app URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      user: session.user as any, // Cast to User type
      planId,
      billingCycle,
      successUrl: `${appUrl}/pricing/success`,
      cancelUrl: `${appUrl}/pricing/cancel`,
      trialDays: 14, // Optional: 14-day trial
      affiliateCode,
    })

    return NextResponse.json({
      sessionId: checkoutSession.sessionId,
      url: checkoutSession.url,
      paymentId: checkoutSession.paymentId,
    })
  } catch (error) {
    console.error('Checkout session creation failed:', error)

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
