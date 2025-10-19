-- =====================================================
-- PHASE 3: Payment, Chat, Jobs & Forum Models
-- Migration SQL for PostgreSQL
-- =====================================================

-- =====================================================
-- PAYMENTS & SUBSCRIPTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS "payments" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "stripe_customer_id" TEXT,
  "stripe_session_id" TEXT UNIQUE,
  "stripe_subscription_id" TEXT,
  "stripe_payment_intent_id" TEXT,
  "plan_id" TEXT NOT NULL,
  "plan_name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'usd',
  "billing_cycle" TEXT NOT NULL DEFAULT 'monthly',
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "payments_user_id_idx" ON "payments"("user_id");
CREATE INDEX IF NOT EXISTS "payments_stripe_customer_idx" ON "payments"("stripe_customer_id");
CREATE INDEX IF NOT EXISTS "payments_stripe_session_idx" ON "payments"("stripe_session_id");
CREATE INDEX IF NOT EXISTS "payments_status_idx" ON "payments"("status");

-- =====================================================
-- CHAT SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS "chat_sessions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT,
  "session_token" TEXT UNIQUE,
  "context" JSONB,
  "metadata" JSONB,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  "ended_at" TIMESTAMP(3),
  CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "chat_sessions_user_id_idx" ON "chat_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "chat_sessions_session_token_idx" ON "chat_sessions"("session_token");
CREATE INDEX IF NOT EXISTS "chat_sessions_is_active_idx" ON "chat_sessions"("is_active");

CREATE TABLE IF NOT EXISTS "chat_messages" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "chat_session_id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "chat_messages_chat_session_id_fkey" FOREIGN KEY ("chat_session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "chat_messages_session_idx" ON "chat_messages"("chat_session_id");
CREATE INDEX IF NOT EXISTS "chat_messages_created_at_idx" ON "chat_messages"("created_at");

-- =====================================================
-- AI JOBS
-- =====================================================

CREATE TABLE IF NOT EXISTS "ai_jobs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "tool" TEXT NOT NULL,
  "prompt" TEXT,
  "options" JSONB,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "result_url" TEXT,
  "result_data" JSONB,
  "error_message" TEXT,
  "progress" INTEGER DEFAULT 0,
  "estimated_time" INTEGER,
  "started_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ai_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ai_jobs_user_id_idx" ON "ai_jobs"("user_id");
CREATE INDEX IF NOT EXISTS "ai_jobs_status_idx" ON "ai_jobs"("status");
CREATE INDEX IF NOT EXISTS "ai_jobs_tool_idx" ON "ai_jobs"("tool");
CREATE INDEX IF NOT EXISTS "ai_jobs_created_at_idx" ON "ai_jobs"("created_at");

-- =====================================================
-- STUDIO JOBS
-- =====================================================

CREATE TABLE IF NOT EXISTS "studio_jobs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "tool" TEXT NOT NULL,
  "input_files" TEXT[],
  "options" JSONB,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "result_url" TEXT,
  "result_data" JSONB,
  "error_message" TEXT,
  "progress" INTEGER DEFAULT 0,
  "started_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "studio_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "studio_jobs_user_id_idx" ON "studio_jobs"("user_id");
CREATE INDEX IF NOT EXISTS "studio_jobs_status_idx" ON "studio_jobs"("status");
CREATE INDEX IF NOT EXISTS "studio_jobs_tool_idx" ON "studio_jobs"("tool");

-- =====================================================
-- FAQ
-- =====================================================

CREATE TABLE IF NOT EXISTS "faq_items" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "category" TEXT,
  "order_index" INTEGER DEFAULT 0,
  "is_published" BOOLEAN NOT NULL DEFAULT true,
  "views" INTEGER DEFAULT 0,
  "helpful_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "faq_items_category_idx" ON "faq_items"("category");
CREATE INDEX IF NOT EXISTS "faq_items_order_idx" ON "faq_items"("order_index");
CREATE INDEX IF NOT EXISTS "faq_items_published_idx" ON "faq_items"("is_published");

-- =====================================================
-- FORUM
-- =====================================================

CREATE TABLE IF NOT EXISTS "forum_topics" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "category" TEXT,
  "is_pinned" BOOLEAN NOT NULL DEFAULT false,
  "is_locked" BOOLEAN NOT NULL DEFAULT false,
  "views" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "forum_topics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_topics_user_id_idx" ON "forum_topics"("user_id");
CREATE INDEX IF NOT EXISTS "forum_topics_category_idx" ON "forum_topics"("category");
CREATE INDEX IF NOT EXISTS "forum_topics_created_at_idx" ON "forum_topics"("created_at");

CREATE TABLE IF NOT EXISTS "forum_comments" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "topic_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "is_solution" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "forum_comments_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "forum_topics"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "forum_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "forum_comments_topic_id_idx" ON "forum_comments"("topic_id");
CREATE INDEX IF NOT EXISTS "forum_comments_user_id_idx" ON "forum_comments"("user_id");

-- =====================================================
-- AFFILIATE SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS "affiliates" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "affiliate_code" TEXT NOT NULL UNIQUE,
  "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 20.00,
  "total_earnings" INTEGER NOT NULL DEFAULT 0,
  "total_referrals" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'active',
  "payout_info" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "affiliates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "affiliates_user_id_idx" ON "affiliates"("user_id");
CREATE INDEX IF NOT EXISTS "affiliates_code_idx" ON "affiliates"("affiliate_code");

CREATE TABLE IF NOT EXISTS "affiliate_referrals" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "affiliate_id" TEXT NOT NULL,
  "referred_user_id" TEXT NOT NULL,
  "payment_id" TEXT,
  "commission_amount" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "affiliate_referrals_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "affiliate_referrals_referred_user_id_fkey" FOREIGN KEY ("referred_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "affiliate_referrals_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "affiliate_referrals_affiliate_idx" ON "affiliate_referrals"("affiliate_id");
CREATE INDEX IF NOT EXISTS "affiliate_referrals_referred_user_idx" ON "affiliate_referrals"("referred_user_id");

-- =====================================================
-- USER SESSIONS (Custom, not NextAuth)
-- =====================================================

CREATE TABLE IF NOT EXISTS "user_sessions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "user_sessions_user_id_idx" ON "user_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "user_sessions_token_idx" ON "user_sessions"("token");
CREATE INDEX IF NOT EXISTS "user_sessions_expires_at_idx" ON "user_sessions"("expires_at");

-- =====================================================
-- USER USAGE TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS "user_usage_stats" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "user_id" TEXT NOT NULL UNIQUE,
  "ai_generations_count" INTEGER NOT NULL DEFAULT 0,
  "studio_jobs_count" INTEGER NOT NULL DEFAULT 0,
  "chat_messages_count" INTEGER NOT NULL DEFAULT 0,
  "storage_used_bytes" BIGINT NOT NULL DEFAULT 0,
  "export_minutes_used" INTEGER NOT NULL DEFAULT 0,
  "voiceover_minutes_used" INTEGER NOT NULL DEFAULT 0,
  "images_generated" INTEGER NOT NULL DEFAULT 0,
  "last_reset_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_usage_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "user_usage_stats_user_id_idx" ON "user_usage_stats"("user_id");

-- =====================================================
-- WEBHOOKS LOG (for debugging Stripe)
-- =====================================================

CREATE TABLE IF NOT EXISTS "webhook_events" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "event_type" TEXT NOT NULL,
  "event_id" TEXT UNIQUE,
  "payload" JSONB NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'received',
  "error_message" TEXT,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "webhook_events_type_idx" ON "webhook_events"("event_type");
CREATE INDEX IF NOT EXISTS "webhook_events_status_idx" ON "webhook_events"("status");
CREATE INDEX IF NOT EXISTS "webhook_events_created_at_idx" ON "webhook_events"("created_at");

-- =====================================================
-- ENUMS (Add to existing enums if needed)
-- =====================================================

-- Payment statuses: pending, processing, paid, failed, refunded, cancelled
-- Job statuses: pending, processing, completed, failed, cancelled
-- Affiliate statuses: active, suspended, terminated
-- Message roles: user, assistant, system

