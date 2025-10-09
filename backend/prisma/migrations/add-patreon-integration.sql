-- Migration: Add Patreon Integration Tables
-- This migration adds all the necessary tables for the Patreon integration

-- Create PatreonConnection table
CREATE TABLE "PatreonConnection" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL UNIQUE,
    "patreonId" TEXT NOT NULL UNIQUE,
    "patreonEmail" TEXT,
    "patreonUsername" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "scopes" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "syncFrequency" TEXT NOT NULL DEFAULT 'hourly',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create PatreonCampaign table
CREATE TABLE "PatreonCampaign" (
    "id" SERIAL PRIMARY KEY,
    "patreonConnectionId" INTEGER NOT NULL,
    "patreonCampaignId" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "goal" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isNsfw" BOOLEAN NOT NULL DEFAULT false,
    "isChargedImmediately" BOOLEAN NOT NULL DEFAULT false,
    "isMonthly" BOOLEAN NOT NULL DEFAULT true,
    "isYearly" BOOLEAN NOT NULL DEFAULT false,
    "patronCount" INTEGER NOT NULL DEFAULT 0,
    "patronCountVisible" BOOLEAN NOT NULL DEFAULT true,
    "payPerName" BOOLEAN NOT NULL DEFAULT false,
    "showEarnings" BOOLEAN NOT NULL DEFAULT false,
    "earnings" DOUBLE PRECISION,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create PatreonTier table
CREATE TABLE "PatreonTier" (
    "id" SERIAL PRIMARY KEY,
    "campaignId" INTEGER NOT NULL,
    "patreonTierId" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "imageUrl" TEXT,
    "patronCount" INTEGER NOT NULL DEFAULT 0,
    "patronCountVisible" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "benefits" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "PatreonTier_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create PatreonPatron table
CREATE TABLE "PatreonPatron" (
    "id" SERIAL PRIMARY KEY,
    "campaignId" INTEGER NOT NULL,
    "tierId" INTEGER,
    "patreonPatronId" TEXT NOT NULL UNIQUE,
    "patreonUserId" TEXT,
    "email" TEXT,
    "fullName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeclined" BOOLEAN NOT NULL DEFAULT false,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "pledgeAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "pledgeStartDate" TIMESTAMP(3),
    "pledgeEndDate" TIMESTAMP(3),
    "lastChargeDate" TIMESTAMP(3),
    "nextChargeDate" TIMESTAMP(3),
    "lastChargeStatus" TEXT,
    "failureReason" TEXT,
    "failureReasonCode" TEXT,
    "failureReasonMessage" TEXT,
    "lifetimeSupport" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "patronStatus" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "PatreonPatron_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PatreonPatron_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PatreonTier"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create PatreonPost table
CREATE TABLE "PatreonPost" (
    "id" SERIAL PRIMARY KEY,
    "campaignId" INTEGER NOT NULL,
    "patreonPostId" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "excerpt" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "embedUrl" TEXT,
    "embedTitle" TEXT,
    "embedDescription" TEXT,
    "embedThumbnailUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isNsfw" BOOLEAN NOT NULL DEFAULT false,
    "isMinCentsEntitled" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "PatreonPost_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create PatreonPayment table
CREATE TABLE "PatreonPayment" (
    "id" SERIAL PRIMARY KEY,
    "patronId" INTEGER NOT NULL,
    "patreonPaymentId" TEXT NOT NULL UNIQUE,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "chargeDate" TIMESTAMP(3),
    "chargeStatus" TEXT,
    "failureReason" TEXT,
    "failureReasonCode" TEXT,
    "failureReasonMessage" TEXT,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "refundAmount" DOUBLE PRECISION,
    "refundDate" TIMESTAMP(3),
    "refundReason" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "PatreonPayment_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "PatreonPatron"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create PatreonWebhookEvent table
CREATE TABLE "PatreonWebhookEvent" (
    "id" SERIAL PRIMARY KEY,
    "patreonConnectionId" INTEGER,
    "campaignId" INTEGER,
    "patronId" INTEGER,
    "eventType" TEXT NOT NULL,
    "patreonData" TEXT NOT NULL,
    "signature" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "nextRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "PatreonWebhookEvent_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PatreonWebhookEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PatreonWebhookEvent_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "PatreonPatron"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create PatreonSyncJob table
CREATE TABLE "PatreonSyncJob" (
    "id" SERIAL PRIMARY KEY,
    "patreonConnectionId" INTEGER NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "metadata" TEXT,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsCreated" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsDeleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    
    CONSTRAINT "PatreonSyncJob_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "PatreonConnection_userId_idx" ON "PatreonConnection"("userId");
CREATE INDEX "PatreonConnection_patreonId_idx" ON "PatreonConnection"("patreonId");
CREATE INDEX "PatreonConnection_isActive_idx" ON "PatreonConnection"("isActive");

CREATE INDEX "PatreonCampaign_patreonConnectionId_idx" ON "PatreonCampaign"("patreonConnectionId");
CREATE INDEX "PatreonCampaign_patreonCampaignId_idx" ON "PatreonCampaign"("patreonCampaignId");
CREATE INDEX "PatreonCampaign_isActive_idx" ON "PatreonCampaign"("isActive");

CREATE INDEX "PatreonTier_campaignId_idx" ON "PatreonTier"("campaignId");
CREATE INDEX "PatreonTier_patreonTierId_idx" ON "PatreonTier"("patreonTierId");
CREATE INDEX "PatreonTier_isActive_idx" ON "PatreonTier"("isActive");

CREATE INDEX "PatreonPatron_campaignId_idx" ON "PatreonPatron"("campaignId");
CREATE INDEX "PatreonPatron_tierId_idx" ON "PatreonPatron"("tierId");
CREATE INDEX "PatreonPatron_patreonPatronId_idx" ON "PatreonPatron"("patreonPatronId");
CREATE INDEX "PatreonPatron_isActive_idx" ON "PatreonPatron"("isActive");
CREATE INDEX "PatreonPatron_patronStatus_idx" ON "PatreonPatron"("patronStatus");

CREATE INDEX "PatreonPost_campaignId_idx" ON "PatreonPost"("campaignId");
CREATE INDEX "PatreonPost_patreonPostId_idx" ON "PatreonPost"("patreonPostId");
CREATE INDEX "PatreonPost_isPublished_idx" ON "PatreonPost"("isPublished");
CREATE INDEX "PatreonPost_isPaid_idx" ON "PatreonPost"("isPaid");

CREATE INDEX "PatreonPayment_patronId_idx" ON "PatreonPayment"("patronId");
CREATE INDEX "PatreonPayment_patreonPaymentId_idx" ON "PatreonPayment"("patreonPaymentId");
CREATE INDEX "PatreonPayment_status_idx" ON "PatreonPayment"("status");
CREATE INDEX "PatreonPayment_chargeDate_idx" ON "PatreonPayment"("chargeDate");

CREATE INDEX "PatreonWebhookEvent_eventType_idx" ON "PatreonWebhookEvent"("eventType");
CREATE INDEX "PatreonWebhookEvent_isProcessed_idx" ON "PatreonWebhookEvent"("isProcessed");
CREATE INDEX "PatreonWebhookEvent_createdAt_idx" ON "PatreonWebhookEvent"("createdAt");

CREATE INDEX "PatreonSyncJob_patreonConnectionId_idx" ON "PatreonSyncJob"("patreonConnectionId");
CREATE INDEX "PatreonSyncJob_jobType_idx" ON "PatreonSyncJob"("jobType");
CREATE INDEX "PatreonSyncJob_status_idx" ON "PatreonSyncJob"("status");
CREATE INDEX "PatreonSyncJob_createdAt_idx" ON "PatreonSyncJob"("createdAt");

-- Add comments to tables
COMMENT ON TABLE "PatreonConnection" IS 'Stores OAuth connections between users and Patreon accounts';
COMMENT ON TABLE "PatreonCampaign" IS 'Stores Patreon campaigns for creators';
COMMENT ON TABLE "PatreonTier" IS 'Stores membership tiers for Patreon campaigns';
COMMENT ON TABLE "PatreonPatron" IS 'Stores patron information and subscription details';
COMMENT ON TABLE "PatreonPost" IS 'Stores posts published on Patreon campaigns';
COMMENT ON TABLE "PatreonPayment" IS 'Stores payment records for patron subscriptions';
COMMENT ON TABLE "PatreonWebhookEvent" IS 'Stores incoming webhook events from Patreon';
COMMENT ON TABLE "PatreonSyncJob" IS 'Tracks synchronization jobs between Patreon and local database';

-- Migration completed successfully
SELECT 'Patreon integration tables created successfully' as migration_status; 