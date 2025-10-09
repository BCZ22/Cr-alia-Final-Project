-- CreateTable
CREATE TABLE "SocialBladeChannel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "totalViews" INTEGER NOT NULL,
    "totalVideos" INTEGER NOT NULL,
    "uploadFrequency" TEXT NOT NULL,
    "averageViews" INTEGER NOT NULL,
    "engagementRate" REAL NOT NULL,
    "rank" INTEGER NOT NULL,
    "countryRank" INTEGER NOT NULL,
    "estimatedMonthlyEarnings" REAL NOT NULL,
    "estimatedYearlyEarnings" REAL NOT NULL,
    "growthRate" REAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialBladeChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialBladeStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "subscribers" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,
    "videos" INTEGER NOT NULL,
    "uploads" INTEGER NOT NULL,
    "growth" REAL NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialBladeStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialBladeComparison" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channel1Id" TEXT NOT NULL,
    "channel2Id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "differences" JSONB NOT NULL,
    "insights" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialBladeComparison_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialBladeInsight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "insightType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "recommendations" JSONB,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SocialBladeInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialBladeReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "channelUrl" TEXT,
    "channelName" TEXT,
    "platform" TEXT,
    "data" JSONB NOT NULL,
    "insights" JSONB,
    "aiRecommendations" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SocialBladeReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialBladeMonitoring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channelUrl" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheck" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SocialBladeMonitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SocialBladeChannel_userId_idx" ON "SocialBladeChannel"("userId");

-- CreateIndex
CREATE INDEX "SocialBladeChannel_channelId_idx" ON "SocialBladeChannel"("channelId");

-- CreateIndex
CREATE INDEX "SocialBladeChannel_platform_idx" ON "SocialBladeChannel"("platform");

-- CreateIndex
CREATE INDEX "SocialBladeStats_userId_idx" ON "SocialBladeStats"("userId");

-- CreateIndex
CREATE INDEX "SocialBladeStats_channelId_idx" ON "SocialBladeStats"("channelId");

-- CreateIndex
CREATE INDEX "SocialBladeStats_platform_idx" ON "SocialBladeStats"("platform");

-- CreateIndex
CREATE INDEX "SocialBladeComparison_userId_idx" ON "SocialBladeComparison"("userId");

-- CreateIndex
CREATE INDEX "SocialBladeComparison_channel1Id_idx" ON "SocialBladeComparison"("channel1Id");

-- CreateIndex
CREATE INDEX "SocialBladeComparison_channel2Id_idx" ON "SocialBladeComparison"("channel2Id");

-- CreateIndex
CREATE INDEX "SocialBladeInsight_userId_idx" ON "SocialBladeInsight"("userId");

-- CreateIndex
CREATE INDEX "SocialBladeInsight_insightType_idx" ON "SocialBladeInsight"("insightType");

-- CreateIndex
CREATE INDEX "SocialBladeReport_userId_idx" ON "SocialBladeReport"("userId");

-- CreateIndex
CREATE INDEX "SocialBladeReport_reportType_idx" ON "SocialBladeReport"("reportType");

-- CreateIndex
CREATE INDEX "SocialBladeReport_platform_idx" ON "SocialBladeReport"("platform");

-- CreateIndex
CREATE INDEX "SocialBladeMonitoring_userId_idx" ON "SocialBladeMonitoring"("userId");

-- CreateIndex
CREATE INDEX "SocialBladeMonitoring_channelUrl_idx" ON "SocialBladeMonitoring"("channelUrl");

-- CreateIndex
CREATE INDEX "SocialBladeMonitoring_platform_idx" ON "SocialBladeMonitoring"("platform");
