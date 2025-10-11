import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import UserService from '@/backend/services/user.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10',
});

const userService = new UserService();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

// Define credit packages based on Price ID from Stripe
const CREDIT_PACKAGES: { [key: string]: number } = {
  [process.env.STRIPE_PRICE_ID_10_CREDITS || 'price_default_10']: 10,
  [process.env.STRIPE_PRICE_ID_50_CREDITS || 'price_default_50']: 50,
  [process.env.STRIPE_PRICE_ID_100_CREDITS || 'price_default_100']: 100,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // Keep this log for security auditing
    console.error(`❌ Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const priceId = session.line_items?.data[0].price?.id;

    if (userId && priceId) {
      const creditsToAdd = CREDIT_PACKAGES[priceId];
      if (creditsToAdd) {
        try {
          await userService.addCredits(userId, creditsToAdd);
        } catch (error) {
          console.error(`Failed to add credits for user ${userId}:`, error);
          return NextResponse.json({ error: 'Database error while adding credits' }, { status: 500 });
        }
      } else {
        console.warn(`No credit package found for price ID: ${priceId}`);
      }
    } else {
      console.error('Missing userId or priceId in checkout session metadata');
    }
  }

  return NextResponse.json({ received: true });
}
