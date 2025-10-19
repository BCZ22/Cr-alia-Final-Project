/**
 * POST /api/stripe-webhook
 * Handle Stripe webhook events
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, handleWebhookEvent } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    // Get raw body
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = verifyWebhookSignature(body, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Webhook event received:', event.type, event.id)

    // Handle event
    await handleWebhookEvent(event)

    // Return success response
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)

    // Still return 200 to acknowledge receipt
    // Stripe will retry if we return error status
    return NextResponse.json(
      {
        received: true,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 200 }
    )
  }
}

// Disable body parsing to get raw body for signature verification
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

