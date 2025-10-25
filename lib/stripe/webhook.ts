/**
 * Stripe Webhook Handlers
 * Process webhook events from Stripe
 */

import Stripe from 'stripe'
import { stripe } from './client'
import { getWebhookSecret } from './config'
import { PaymentRepository, UserRepository } from '@/lib/db/repositories'
import { prisma } from '@/lib/db/client'

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = getWebhookSecret()

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
    return event
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    throw new Error('Invalid webhook signature')
  }
}

/**
 * Log webhook event to database
 */
async function logWebhookEvent(
  eventType: string,
  eventId: string,
  payload: any,
  status: string = 'received',
  errorMessage?: string
) {
  try {
    await prisma.webhookEvent.create({
      data: {
        eventType,
        eventId,
        payload,
        status,
        errorMessage,
        processedAt: status === 'processed' ? new Date() : undefined,
      },
    })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed for session ID:', session.id);

  const { userId, priceId } = session.metadata || {};
  const stripeSubscriptionId = session.subscription as string;
  const stripeCustomerId = session.customer as string;

  if (!userId || !priceId || !stripeSubscriptionId || !stripeCustomerId) {
    throw new Error(
      `Webhook Error: Missing metadata from checkout.session.completed. 
      Required: userId, priceId. 
      Got: userId=${userId}, priceId=${priceId}`
    );
  }
  
  // --- IDEMPOTENCY CHECK ---
  // Prevent duplicate processing by checking if a payment for this session already exists.
  const existingPayment = await prisma.payment.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (existingPayment) {
    console.log(`Webhook event for session ${session.id} already processed. Skipping.`);
    return;
  }
  
  // --- CREATE SUBSCRIPTION & PAYMENT RECORDS ---
  
  // Get plan details from priceId (this is simplified)
  // In a real app, you might have a table mapping price IDs to plan names/features
  const planId = priceId.includes('pro') ? 'PRO' : 'CREATOR';
  
  // Create the subscription record
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      stripeSubscriptionId,
      status: 'ACTIVE',
      plan: planId,
      // The start date is available on the subscription object from Stripe,
      // but we'll use now() for simplicity as it's created upon completion.
      startDate: new Date(),
    },
  });

  // Create the initial payment record
  await prisma.payment.create({
    data: {
      userId,
      stripeSessionId: session.id,
      stripeCustomerId,
      planId: planId,
      status: 'PAID',
      amount: (session.amount_total ?? 0) / 100, // Amount is in cents
      currency: session.currency ?? 'eur',
      billingCycle: 'monthly', // This should be derived from the price object
    },
  });
  
  // --- UPDATE USER ROLE/ACCESS ---
  await prisma.user.update({
    where: { id: userId },
    data: {
      role: 'PRO', // Grant user the PRO role
    },
  });

  console.log(`Successfully created subscription ${subscription.id} for user ${userId}`);
}

/**
 * Handle invoice.payment_succeeded event
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_succeeded:', invoice.id)

  const subscriptionId = invoice.subscription as string
  const customerId = invoice.customer as string

  if (!subscriptionId) {
    console.warn('No subscription ID in invoice')
    return
  }

  // Find payment by subscription ID
  const payment = await prisma.payment.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    orderBy: { createdAt: 'desc' },
  })

  if (!payment) {
    console.warn('No payment found for subscription:', subscriptionId)
    return
  }

  // For recurring payments, create a new payment record
  if (payment.status === 'PAID') {
    await PaymentRepository.create({
      userId: payment.userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePaymentIntentId: invoice.payment_intent as string,
      planId: payment.planId,
      planName: payment.planName,
      status: 'PAID',
      amount: invoice.amount_paid,
      currency: invoice.currency,
      billingCycle: payment.billingCycle,
      metadata: {
        invoiceId: invoice.id,
        recurring: true,
      },
    })
  }

  console.log('Invoice payment processed:', invoice.id)
}

/**
 * Handle invoice.payment_failed event
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id)

  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return
  }

  // Find payment
  const payment = await prisma.payment.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    orderBy: { createdAt: 'desc' },
  })

  if (payment) {
    await PaymentRepository.markAsFailed(
      payment.id,
      `Payment failed: ${invoice.id}`
    )
  }

  console.log('Payment marked as FAILED')
}

/**
 * Handle customer.subscription.updated event
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id)

  // Find payment
  const payment = await prisma.payment.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    orderBy: { createdAt: 'desc' },
  })

  if (!payment) {
    console.warn('No payment found for subscription:', subscription.id)
    return
  }

  // Update payment metadata with subscription status
  await PaymentRepository.update(payment.id, {
    metadata: {
      ...((payment.metadata as any) || {}),
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })

  console.log('Subscription updated:', subscription.id)
}

/**
 * Handle customer.subscription.deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id)

  // Find payment
  const payment = await prisma.payment.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    orderBy: { createdAt: 'desc' },
  })

  if (!payment) {
    return
  }

  // Mark as cancelled
  await PaymentRepository.update(payment.id, {
    status: 'CANCELLED',
    metadata: {
      ...((payment.metadata as any) || {}),
      cancelledAt: new Date().toISOString(),
      cancelReason: subscription.cancellation_details?.reason,
    },
  })

  console.log('Subscription cancelled:', subscription.id)
}

/**
 * Main webhook handler
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  console.log('Processing webhook event:', event.type, event.id)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      default:
        console.log('Unhandled event type:', event.type)
    }

    // Log as processed
    await logWebhookEvent(event.type, event.id, event.data.object, 'processed')
  } catch (error) {
    console.error('Error processing webhook:', error)
    await logWebhookEvent(
      event.type,
      event.id,
      event.data.object,
      'failed',
      error instanceof Error ? error.message : 'Unknown error'
    )
    throw error
  }
}

