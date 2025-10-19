/**
 * Stripe Configuration
 * Maps plan IDs to Stripe Price IDs from canonical data
 */

import canonicalData from '@/data/canonical-site-data.json'

export interface StripePriceConfig {
  priceId: string
  planId: string
  planName: string
  amount: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
}

/**
 * Get Stripe Price ID from environment variables
 */
export function getStripePriceId(
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): string {
  const envKey = `STRIPE_PRICE_${planId.toUpperCase()}_${billingCycle.toUpperCase()}`
  const priceId = process.env[envKey]

  if (!priceId) {
    throw new Error(
      `Stripe Price ID not found for ${planId} (${billingCycle}). ` +
        `Please set ${envKey} in environment variables.`
    )
  }

  return priceId
}

/**
 * Get plan configuration from canonical data
 */
export function getPlanConfig(
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): StripePriceConfig {
  const plans = canonicalData.pricing.plans[billingCycle]
  const plan = plans.find((p) => p.id === planId)

  if (!plan) {
    throw new Error(`Plan ${planId} not found in canonical data`)
  }

  return {
    priceId: getStripePriceId(planId, billingCycle),
    planId: plan.id,
    planName: plan.name,
    amount: plan.price * 100, // Convert to cents
    currency: plan.currency.toLowerCase(),
    billingCycle,
  }
}

/**
 * Validate plan ID
 */
export function isValidPlanId(planId: string): boolean {
  const validPlans = ['creator', 'viral', 'pro']
  return validPlans.includes(planId)
}

/**
 * Get all available plans
 */
export function getAllPlans(): StripePriceConfig[] {
  const plans: StripePriceConfig[] = []

  for (const billingCycle of ['monthly', 'yearly'] as const) {
    for (const planId of ['creator', 'viral', 'pro']) {
      try {
        plans.push(getPlanConfig(planId, billingCycle))
      } catch (error) {
        console.warn(`Could not load plan ${planId} (${billingCycle}):`, error)
      }
    }
  }

  return plans
}

/**
 * Webhook secret
 */
export function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables')
  }

  return secret
}

/**
 * Get public key for client-side
 */
export function getPublicKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined')
  }

  return key
}

