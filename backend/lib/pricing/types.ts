export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  limits: {
    projects: number
    aiGenerations: number
    storage: number // in GB
    teamMembers: number
  }
  popular?: boolean
  stripePriceId?: string
}

export interface CheckoutSession {
  id: string
  url: string
  expiresAt: string
}

export interface CreateCheckoutSessionRequest {
  priceId: string
  successUrl?: string
  cancelUrl?: string
  customerId?: string
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  plan: PricingPlan
  cancelAtPeriodEnd: boolean
  cancelAt?: string
}

export interface BillingInfo {
  customerId: string
  email: string
  name?: string
  address?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod?: {
    id: string
    type: string
    last4: string
    brand: string
    expMonth: number
    expYear: number
  }
}

export interface Invoice {
  id: string
  number: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  amount: number
  currency: string
  created: string
  dueDate?: string
  paidAt?: string
  downloadUrl?: string
}
