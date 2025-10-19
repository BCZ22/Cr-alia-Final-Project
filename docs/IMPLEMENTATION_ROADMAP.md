# 🚀 Créalia - Roadmap d'Implémentation Full-Stack

## Executive Summary

**Status**: Phase 1 (Discovery) COMPLETED  
**Priority**: P0 - Critical Infrastructure  
**Timeline**: 4-6 semaines  
**Stack**: Next.js 14 + Vercel + Stripe + OpenAI + PostgreSQL

---

## 📊 Phase 1: Discovery - COMPLETED ✅

### Findings
- **30 pages** scannées
- **87 boutons** identifiés
- **42 boutons manquants/cassés** (48% broken rate)
- **6 issues critiques P0**

### Critical Gaps
1. ❌ No Stripe payment integration
2. ❌ No user authentication system
3. ❌ No database/sessions
4. ❌ No AI backend endpoints
5. ❌ No chat system
6. ❌ No webhooks

### Reports Generated
- `docs/PHASE1_DISCOVERY_REPORT.json` - Full button inventory
- `docs/routes.json` - Complete route mapping

---

## 🎯 Phase 2-4: Core Infrastructure (PRIORITY P0)

### Phase 2: Database Schema ✅

```sql
-- Users & Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  amount INTEGER,
  currency TEXT DEFAULT 'usd',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  context_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Jobs (async processing)
CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool TEXT NOT NULL, -- 'reels' | 'avatar' | 'images' | 'voiceover' | 'subtitles' | 'memes'
  prompt TEXT,
  options JSONB,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'processing' | 'completed' | 'failed'
  result_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studio Jobs
CREATE TABLE studio_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tool TEXT NOT NULL, -- 'video-editor' | 'collage' | 'instagram' | 'facebook' | 'add-music' | 'add-text'
  input_files TEXT[],
  options JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  result_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum (optional)
CREATE TABLE forum_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_chat_sessions_user ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session ON chat_messages(chat_session_id);
CREATE INDEX idx_ai_jobs_user ON ai_jobs(user_id);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_studio_jobs_user ON studio_jobs(user_id);
CREATE INDEX idx_studio_jobs_status ON studio_jobs(status);
```

### Phase 3: Authentication (NextAuth.js)

**File**: `app/api/auth/[...nextauth]/route.ts` (already exists)

**TODO**:
- Add database adapter (Prisma/Supabase)
- Add JWT strategy
- Add Google OAuth
- Add Credentials provider with registration

### Phase 4: Stripe Integration 🎯 **TOP PRIORITY**

#### Endpoint 1: Create Checkout Session

**File**: `app/api/checkout/create-session/route.ts`

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { userId, planId, billingCycle } = await req.json();
    
    // Get user from DB
    const user = await db.user.findUnique({ where: { id: userId } });
    
    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }
    
    // Get price ID from env
    const priceId = process.env[`STRIPE_PRICE_${planId.toUpperCase()}_${billingCycle.toUpperCase()}`];
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/cancel`,
      metadata: { userId: user.id, planId, billingCycle },
    });
    
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
```

#### Endpoint 2: Stripe Webhook

**File**: `app/api/stripe-webhook/route.ts`

```typescript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSuccess(invoice);
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;
    }
  }
  
  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  
  await db.payment.create({
    data: {
      userId,
      stripeSessionId: session.id,
      stripeSubscriptionId: session.subscription as string,
      plan: planId!,
      status: 'paid',
      amount: session.amount_total,
      currency: session.currency,
    },
  });
  
  await db.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: 'active',
      subscriptionPlan: planId,
    },
  });
}
```

---

## 📋 Next Immediate Steps

### Week 1-2: Core Payment Flow
1. ✅ Setup database (Supabase recommended)
2. ✅ Implement Stripe checkout endpoint
3. ✅ Implement Stripe webhook
4. ✅ Update pricing page buttons
5. ✅ Create success/cancel pages
6. ✅ Test payment flow end-to-end

### Week 3-4: Chat System
1. ✅ Create chat API endpoints
2. ✅ Integrate OpenAI
3. ✅ Build chat UI component
4. ✅ Implement FAQ API
5. ✅ Test chat flow

### Week 5-6: AI & Studio Tools
1. ✅ Create job queue system
2. ✅ Implement AI endpoints (one by one)
3. ✅ Add file upload support
4. ✅ Build job status polling
5. ✅ Create galleries

---

## 🚨 Critical Blockers

1. **No database configured** - Need DATABASE_URL
2. **No Stripe keys** - Need STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
3. **No AI keys** - Need OPENAI_API_KEY
4. **No authentication** - NextAuth needs adapter

---

## 📦 Required Vercel Environment Variables

See `env.production.example` for complete list.

**Critical variables**:
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

---

## ✅ Acceptance Criteria

Before going to production:

- [ ] All buttons redirect correctly
- [ ] Stripe payment works end-to-end
- [ ] Webhook creates payment records
- [ ] Users can register/login
- [ ] Chat sends messages and receives AI responses
- [ ] At least 1 AI tool fully functional
- [ ] Error handling on all endpoints
- [ ] E2E tests passing
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring/logging active

---

## 📞 Support & Contact

For implementation questions, refer to:
- `docs/PHASE1_DISCOVERY_REPORT.json` - Full button audit
- `docs/routes.json` - Route mappings
- `env.production.example` - Environment setup

**Next Step**: Implement Stripe integration (Phase 4)

