-- CreateTable
CREATE TABLE "BuzzSumoContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "publishedDate" TEXT NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "facebookShares" INTEGER NOT NULL,
    "twitterShares" INTEGER NOT NULL,
    "linkedinShares" INTEGER NOT NULL,
    "pinterestShares" INTEGER NOT NULL,
    "redditShares" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BuzzSumoContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuzzSumoTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "keyword" TEXT NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "articleCount" INTEGER NOT NULL,
    "averageShares" REAL NOT NULL,
    "trendingScore" REAL NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BuzzSumoTrend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuzzSumoInfluencer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "articleCount" INTEGER NOT NULL,
    "averageShares" REAL NOT NULL,
    "topContent" JSONB NOT NULL,
    "query" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BuzzSumoInfluencer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuzzSumoTopic" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "totalShares" INTEGER NOT NULL,
    "articleCount" INTEGER NOT NULL,
    "averageShares" REAL NOT NULL,
    "trendingScore" REAL NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BuzzSumoTopic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuzzSumoInsight" (
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
    CONSTRAINT "BuzzSumoInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuzzSumoReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "insights" JSONB,
    "aiRecommendations" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuzzSumoReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BuzzSumoMonitoring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheck" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuzzSumoMonitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BuzzSumoContent_userId_idx" ON "BuzzSumoContent"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoContent_query_idx" ON "BuzzSumoContent"("query");

-- CreateIndex
CREATE INDEX "BuzzSumoContent_domain_idx" ON "BuzzSumoContent"("domain");

-- CreateIndex
CREATE INDEX "BuzzSumoTrend_userId_idx" ON "BuzzSumoTrend"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoTrend_keyword_idx" ON "BuzzSumoTrend"("keyword");

-- CreateIndex
CREATE INDEX "BuzzSumoTrend_country_idx" ON "BuzzSumoTrend"("country");

-- CreateIndex
CREATE INDEX "BuzzSumoInfluencer_userId_idx" ON "BuzzSumoInfluencer"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoInfluencer_name_idx" ON "BuzzSumoInfluencer"("name");

-- CreateIndex
CREATE INDEX "BuzzSumoInfluencer_domain_idx" ON "BuzzSumoInfluencer"("domain");

-- CreateIndex
CREATE INDEX "BuzzSumoTopic_userId_idx" ON "BuzzSumoTopic"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoTopic_topic_idx" ON "BuzzSumoTopic"("topic");

-- CreateIndex
CREATE INDEX "BuzzSumoTopic_country_idx" ON "BuzzSumoTopic"("country");

-- CreateIndex
CREATE INDEX "BuzzSumoInsight_userId_idx" ON "BuzzSumoInsight"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoInsight_insightType_idx" ON "BuzzSumoInsight"("insightType");

-- CreateIndex
CREATE INDEX "BuzzSumoReport_userId_idx" ON "BuzzSumoReport"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoReport_reportType_idx" ON "BuzzSumoReport"("reportType");

-- CreateIndex
CREATE INDEX "BuzzSumoReport_query_idx" ON "BuzzSumoReport"("query");

-- CreateIndex
CREATE INDEX "BuzzSumoMonitoring_userId_idx" ON "BuzzSumoMonitoring"("userId");

-- CreateIndex
CREATE INDEX "BuzzSumoMonitoring_topic_idx" ON "BuzzSumoMonitoring"("topic");

-- CreateIndex
CREATE INDEX "BuzzSumoMonitoring_reportType_idx" ON "BuzzSumoMonitoring"("reportType");
