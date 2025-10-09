import { PrismaClient, Subscription } from '@prisma/client';
import { PrismaService } from './prisma/prisma.service';

// In a real app, this would be retrieved from a config file or database
const PLANS = {
  free: { name: 'Free', price: 0, features: ['10 AI generations', '1 project'] },
  pro: { name: 'Pro', price: 29, features: ['Unlimited AI generations', '10 projects', 'Pro templates'] },
  enterprise: { name: 'Enterprise', price: 99, features: ['All Pro features', 'Team collaboration', 'Priority support'] },
};

export class PricingService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaService();
  }

  /**
   * Creates a checkout session.
   * This is a MOCK implementation that simulates creating a Stripe Checkout Session.
   */
  async createCheckoutSession(plan: 'pro' | 'enterprise', userId: string): Promise<{ checkoutUrl: string; sessionId: string }> {
    console.log(`Creating checkout session for user ${userId} and plan ${plan}`);
    
    // In a real implementation with Stripe:
    // 1. You would create a Stripe customer if one doesn't exist for the userId.
    // 2. You would use stripe.checkout.sessions.create() to get a session URL.
    
    // MOCK implementation:
    const sessionId = `mock_session_${Date.now()}`;
    const checkoutUrl = `/mock-checkout?plan=${plan}&sessionId=${sessionId}&userId=${userId}`;

    return { checkoutUrl, sessionId };
  }

  /**
   * Handles incoming webhooks (e.g., from Stripe).
   * This is a MOCK implementation.
   */
  async handleWebhook(event: { type: string; data: any }): Promise<void> {
    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        const { userId, plan } = event.data;
        // In a real implementation, you would get this data from the Stripe event object.
        await this.activateSubscription(userId, plan);
        break;
      
      // You would handle other events like 'customer.subscription.deleted', etc.
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
  
  /**
   * Activates or updates a user's subscription.
   */
  private async activateSubscription(userId: string, plan: 'pro' | 'enterprise'): Promise<Subscription> {
    const planDetails = PLANS[plan];
    if (!planDetails) {
      throw new Error('Invalid plan specified');
    }
    
    const subscriptionData = {
      plan,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Mock 30-day subscription
      features: planDetails.features,
      userId,
    };

    // Use upsert to create a new subscription or update an existing one
    return this.prisma.subscription.upsert({
      where: { userId },
      update: subscriptionData,
      create: subscriptionData,
    });
  }
}

export default PricingService;

