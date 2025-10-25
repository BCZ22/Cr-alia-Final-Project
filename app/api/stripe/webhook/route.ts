import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature, handleWebhookEvent } from '@/lib/stripe/webhook';
import { Stripe } from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const signature = headers().get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
    }

    const payload = await req.text();
    
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(payload, signature);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }

    // Handle the event
    await handleWebhookEvent(event);

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[API] Stripe Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
