/**
 * Stripe Checkout Utilities
 * Functions to create and manage checkout sessions
 */

import { stripe } from './client'
import { getPlanConfig } from './config'
import { PaymentRepository } from '@/lib/db/repositories'
import type { User } from '@prisma/client'

export interface CreateCheckoutSessionParams {
  user: User
  planId: string
  billingCycle: 'monthly' | 'yearly'
  successUrl: string
  cancelUrl: string
  trialDays?: number
  affiliateCode?: string
}

export interface CheckoutSessionResult {
  sessionId: string
  url: string
  paymentId: string
}

/**
 * Create or get Stripe customer for user
 */
export async function getOrCreateStripeCustomer(user: User): Promise<string> {
  // Check if user already has a Stripe customer ID
  // Note: You may need to add stripeCustomerId field to User model
  // For now, we search by email
  
  const customers = await stripe.customers.list({
    email: user.email!,
    limit: 1,
  })

  if (customers.data.length > 0) {
    return customers.data[0].id
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: user.email!,
    name: user.name || undefined,
    metadata: {
      userId: user.id,
    },
  })

  return customer.id
}

/**
 * Create Stripe Checkout Session
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<CheckoutSessionResult> {
  const { user, planId, billingCycle, successUrl, cancelUrl, trialDays, affiliateCode } = params

  // Get plan configuration
  const planConfig = getPlanConfig(planId, billingCycle)

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomer(user)

  // Create payment record in database (PENDING)
  const payment = await PaymentRepository.create({
    userId: user.id,
    stripeCustomerId: customerId,
    planId: planConfig.planId,
    planName: planConfig.planName,
    amount: planConfig.amount,
    currency: planConfig.currency,
    billingCycle: planConfig.billingCycle,
    metadata: {
      affiliateCode,
    },
  })

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
    },
    subscription_data: trialDays
      ? {
          trial_period_days: trialDays,
          metadata: {
            userId: user.id,
            paymentId: payment.id,
            planId: planConfig.planId,
            billingCycle: planConfig.billingCycle,
          },
        }
      : {
          metadata: {
            userId: user.id,
            paymentId: payment.id,
            planId: planConfig.planId,
            billingCycle: planConfig.billingCycle,
          },
        },
    metadata: {
      userId: user.id,
      paymentId: payment.id,
      planId: planConfig.planId,
      billingCycle: planConfig.billingCycle,
    },
  })

  // Update payment with session ID
  await PaymentRepository.update(payment.id, {
    stripeSessionId: session.id,
    status: 'PROCESSING',
  })

  return {
    sessionId: session.id,
    url: session.url!,
    paymentId: payment.id,
  }
}

/**
 * Get checkout session details
 */
export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['customer', 'subscription'],
  })

  return session
}

/**
 * Create customer portal session (for managing subscription)
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

