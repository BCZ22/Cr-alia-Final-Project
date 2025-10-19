/**
 * Stripe Module - Public API
 * Exports all Stripe utilities
 */

export { stripe, default as stripeClient } from './client'

export {
  getStripePriceId,
  getPlanConfig,
  isValidPlanId,
  getAllPlans,
  getWebhookSecret,
  getPublicKey,
} from './config'

export type { StripePriceConfig } from './config'

export {
  createCheckoutSession,
  getCheckoutSession,
  createCustomerPortalSession,
  getOrCreateStripeCustomer,
} from './checkout'

export type { CreateCheckoutSessionParams, CheckoutSessionResult } from './checkout'

export { verifyWebhookSignature, handleWebhookEvent } from './webhook'

