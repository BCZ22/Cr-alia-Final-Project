-- CreateTable
CREATE TABLE "InstagramComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instagramConnectionId" INTEGER NOT NULL,
    "commentId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorUsername" TEXT,
    "text" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "timestamp" DATETIME NOT NULL,
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "parentCommentId" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstagramComment_instagramConnectionId_fkey" FOREIGN KEY ("instagramConnectionId") REFERENCES "InstagramConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonCampaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "patreonCampaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "monthlyGoal" INTEGER,
    "monthlyAmount" INTEGER NOT NULL DEFAULT 0,
    "patronCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonCampaign_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonPatron" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "patreonPatronId" TEXT NOT NULL,
    "email" TEXT,
    "fullName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "vanity" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastChargeStatus" TEXT,
    "lastChargeDate" DATETIME,
    "pledgeAmount" INTEGER NOT NULL DEFAULT 0,
    "pledgeCurrency" TEXT NOT NULL DEFAULT 'USD',
    "pledgeStartDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonPatron_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "patreonPostId" TEXT NOT NULL,
    "campaignId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "publishedAt" DATETIME,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPaidPost" BOOLEAN NOT NULL DEFAULT false,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonPost_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PatreonPost_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign" ("patreonCampaignId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonTier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "campaignId" TEXT,
    "patreonTierId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "patronCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonTier_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PatreonTier_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign" ("patreonCampaignId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonPayment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "campaignId" TEXT,
    "tierId" TEXT,
    "patronId" TEXT,
    "patreonPaymentId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "chargeDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonPayment_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PatreonPayment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PatreonCampaign" ("patreonCampaignId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PatreonPayment_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "PatreonTier" ("patreonTierId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PatreonPayment_patronId_fkey" FOREIGN KEY ("patronId") REFERENCES "PatreonPatron" ("patreonPatronId") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonWebhookEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PatreonWebhookEvent_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonSyncJob" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "patreonConnectionId" INTEGER NOT NULL,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "errorMessage" TEXT,
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonSyncJob_patreonConnectionId_fkey" FOREIGN KEY ("patreonConnectionId") REFERENCES "PatreonConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StackExchangeConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "stackExchangeId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StackExchangeConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StackExchangeAuthState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL,
    "userId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "StackExchangeAuthState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokScrapedTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hashtag" TEXT NOT NULL,
    "videoCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "trendingScore" REAL NOT NULL DEFAULT 0.0,
    "region" TEXT,
    "language" TEXT,
    "category" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TikTokScrapedTrend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "videoId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorName" TEXT,
    "description" TEXT,
    "hashtags" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER,
    "region" TEXT,
    "language" TEXT,
    "category" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TikTokVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "engagement" REAL NOT NULL DEFAULT 0.0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TikTokAnalytics_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "TikTokVideo" ("videoId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ScheduledPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "publishedAt" DATETIME,
    "errorMessage" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CanvaConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CanvaConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeneratedDesign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "canvaConnectionId" INTEGER NOT NULL,
    "designId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GeneratedDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GeneratedDesign_canvaConnectionId_fkey" FOREIGN KEY ("canvaConnectionId") REFERENCES "CanvaConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RunwayVideoStyle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RunwayVideoPrompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RunwayVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "styleId" INTEGER,
    "promptId" INTEGER,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "generationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "outputUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "metadata" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RunwayVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RunwayVideo_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "RunwayVideoStyle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "RunwayVideo_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "RunwayVideoPrompt" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SynthesiaVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "videoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "script" TEXT NOT NULL,
    "avatarId" TEXT,
    "voiceId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "outputUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "metadata" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SynthesiaVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PayPalTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "description" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PayPalTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LaterConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LaterConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LaterProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "laterConnectionId" INTEGER NOT NULL,
    "laterProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "username" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isConnected" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LaterProfile_laterConnectionId_fkey" FOREIGN KEY ("laterConnectionId") REFERENCES "LaterConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LaterPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "laterConnectionId" INTEGER NOT NULL,
    "laterPostId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "scheduledAt" DATETIME,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL,
    "profileId" TEXT,
    "platform" TEXT,
    "permalink" TEXT,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LaterPost_laterConnectionId_fkey" FOREIGN KEY ("laterConnectionId") REFERENCES "LaterConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PatreonCampaignToPatreonPatron" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PatreonCampaignToPatreonPatron_A_fkey" FOREIGN KEY ("A") REFERENCES "PatreonCampaign" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PatreonCampaignToPatreonPatron_B_fkey" FOREIGN KEY ("B") REFERENCES "PatreonPatron" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PatreonPatronToPatreonTier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PatreonPatronToPatreonTier_A_fkey" FOREIGN KEY ("A") REFERENCES "PatreonPatron" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PatreonPatronToPatreonTier_B_fkey" FOREIGN KEY ("B") REFERENCES "PatreonTier" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InstagramComment_commentId_key" ON "InstagramComment"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramComment_instagramConnectionId_commentId_key" ON "InstagramComment"("instagramConnectionId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonCampaign_patreonCampaignId_key" ON "PatreonCampaign"("patreonCampaignId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonCampaign_patreonConnectionId_patreonCampaignId_key" ON "PatreonCampaign"("patreonConnectionId", "patreonCampaignId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonPatron_patreonPatronId_key" ON "PatreonPatron"("patreonPatronId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonPatron_patreonConnectionId_patreonPatronId_key" ON "PatreonPatron"("patreonConnectionId", "patreonPatronId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonPost_patreonPostId_key" ON "PatreonPost"("patreonPostId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonPost_patreonConnectionId_patreonPostId_key" ON "PatreonPost"("patreonConnectionId", "patreonPostId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonTier_patreonTierId_key" ON "PatreonTier"("patreonTierId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonTier_patreonConnectionId_patreonTierId_key" ON "PatreonTier"("patreonConnectionId", "patreonTierId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonPayment_patreonPaymentId_key" ON "PatreonPayment"("patreonPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonPayment_patreonConnectionId_patreonPaymentId_key" ON "PatreonPayment"("patreonConnectionId", "patreonPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonWebhookEvent_eventId_key" ON "PatreonWebhookEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonWebhookEvent_patreonConnectionId_eventId_key" ON "PatreonWebhookEvent"("patreonConnectionId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonSyncJob_patreonConnectionId_jobType_key" ON "PatreonSyncJob"("patreonConnectionId", "jobType");

-- CreateIndex
CREATE UNIQUE INDEX "StackExchangeConnection_userId_stackExchangeId_key" ON "StackExchangeConnection"("userId", "stackExchangeId");

-- CreateIndex
CREATE UNIQUE INDEX "StackExchangeAuthState_state_key" ON "StackExchangeAuthState"("state");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokScrapedTrend_hashtag_region_scrapedAt_key" ON "TikTokScrapedTrend"("hashtag", "region", "scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokVideo_videoId_key" ON "TikTokVideo"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokVideo_userId_videoId_key" ON "TikTokVideo"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokAnalytics_videoId_date_key" ON "TikTokAnalytics"("videoId", "date");

-- CreateIndex
CREATE INDEX "ScheduledPost_userId_idx" ON "ScheduledPost"("userId");

-- CreateIndex
CREATE INDEX "ScheduledPost_scheduledAt_idx" ON "ScheduledPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "ScheduledPost_status_idx" ON "ScheduledPost"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CanvaConnection_userId_key" ON "CanvaConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedDesign_designId_key" ON "GeneratedDesign"("designId");

-- CreateIndex
CREATE INDEX "GeneratedDesign_userId_idx" ON "GeneratedDesign"("userId");

-- CreateIndex
CREATE INDEX "GeneratedDesign_canvaConnectionId_idx" ON "GeneratedDesign"("canvaConnectionId");

-- CreateIndex
CREATE UNIQUE INDEX "RunwayVideoStyle_name_key" ON "RunwayVideoStyle"("name");

-- CreateIndex
CREATE INDEX "RunwayVideoStyle_category_idx" ON "RunwayVideoStyle"("category");

-- CreateIndex
CREATE INDEX "RunwayVideoStyle_popularity_idx" ON "RunwayVideoStyle"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "RunwayVideoPrompt_name_key" ON "RunwayVideoPrompt"("name");

-- CreateIndex
CREATE INDEX "RunwayVideoPrompt_category_idx" ON "RunwayVideoPrompt"("category");

-- CreateIndex
CREATE INDEX "RunwayVideoPrompt_usageCount_idx" ON "RunwayVideoPrompt"("usageCount");

-- CreateIndex
CREATE UNIQUE INDEX "RunwayVideo_videoId_key" ON "RunwayVideo"("videoId");

-- CreateIndex
CREATE INDEX "RunwayVideo_userId_idx" ON "RunwayVideo"("userId");

-- CreateIndex
CREATE INDEX "RunwayVideo_styleId_idx" ON "RunwayVideo"("styleId");

-- CreateIndex
CREATE INDEX "RunwayVideo_promptId_idx" ON "RunwayVideo"("promptId");

-- CreateIndex
CREATE INDEX "RunwayVideo_status_idx" ON "RunwayVideo"("status");

-- CreateIndex
CREATE INDEX "RunwayVideo_generationType_idx" ON "RunwayVideo"("generationType");

-- CreateIndex
CREATE INDEX "RunwayVideo_createdAt_idx" ON "RunwayVideo"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SynthesiaVideo_videoId_key" ON "SynthesiaVideo"("videoId");

-- CreateIndex
CREATE INDEX "SynthesiaVideo_userId_idx" ON "SynthesiaVideo"("userId");

-- CreateIndex
CREATE INDEX "SynthesiaVideo_status_idx" ON "SynthesiaVideo"("status");

-- CreateIndex
CREATE INDEX "SynthesiaVideo_language_idx" ON "SynthesiaVideo"("language");

-- CreateIndex
CREATE INDEX "SynthesiaVideo_createdAt_idx" ON "SynthesiaVideo"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PayPalTransaction_transactionId_key" ON "PayPalTransaction"("transactionId");

-- CreateIndex
CREATE INDEX "PayPalTransaction_userId_idx" ON "PayPalTransaction"("userId");

-- CreateIndex
CREATE INDEX "PayPalTransaction_status_idx" ON "PayPalTransaction"("status");

-- CreateIndex
CREATE INDEX "PayPalTransaction_createdAt_idx" ON "PayPalTransaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "LaterConnection_userId_key" ON "LaterConnection"("userId");

-- CreateIndex
CREATE INDEX "LaterConnection_userId_idx" ON "LaterConnection"("userId");

-- CreateIndex
CREATE INDEX "LaterConnection_isActive_idx" ON "LaterConnection"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "LaterProfile_laterProfileId_key" ON "LaterProfile"("laterProfileId");

-- CreateIndex
CREATE INDEX "LaterProfile_laterConnectionId_idx" ON "LaterProfile"("laterConnectionId");

-- CreateIndex
CREATE INDEX "LaterProfile_laterProfileId_idx" ON "LaterProfile"("laterProfileId");

-- CreateIndex
CREATE INDEX "LaterProfile_service_idx" ON "LaterProfile"("service");

-- CreateIndex
CREATE UNIQUE INDEX "LaterPost_laterPostId_key" ON "LaterPost"("laterPostId");

-- CreateIndex
CREATE INDEX "LaterPost_laterConnectionId_idx" ON "LaterPost"("laterConnectionId");

-- CreateIndex
CREATE INDEX "LaterPost_laterPostId_idx" ON "LaterPost"("laterPostId");

-- CreateIndex
CREATE INDEX "LaterPost_status_idx" ON "LaterPost"("status");

-- CreateIndex
CREATE INDEX "LaterPost_scheduledAt_idx" ON "LaterPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "LaterPost_platform_idx" ON "LaterPost"("platform");

-- CreateIndex
CREATE UNIQUE INDEX "_PatreonCampaignToPatreonPatron_AB_unique" ON "_PatreonCampaignToPatreonPatron"("A", "B");

-- CreateIndex
CREATE INDEX "_PatreonCampaignToPatreonPatron_B_index" ON "_PatreonCampaignToPatreonPatron"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PatreonPatronToPatreonTier_AB_unique" ON "_PatreonPatronToPatreonTier"("A", "B");

-- CreateIndex
CREATE INDEX "_PatreonPatronToPatreonTier_B_index" ON "_PatreonPatronToPatreonTier"("B");
