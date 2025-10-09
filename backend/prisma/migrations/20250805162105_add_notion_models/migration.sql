-- CreateTable
CREATE TABLE "NotionDatabase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "databaseId" TEXT NOT NULL,
    "databaseName" TEXT NOT NULL,
    "description" TEXT,
    "properties" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NotionDatabase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotionPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "databaseId" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "aiScore" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT NOT NULL,
    "aiRecommendations" TEXT,
    "tags" TEXT,
    "dueDate" DATETIME,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "platform" TEXT,
    "targetAudience" TEXT,
    "keywords" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NotionPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NotionReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportData" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NotionReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "NotionDatabase_databaseId_key" ON "NotionDatabase"("databaseId");

-- CreateIndex
CREATE INDEX "NotionDatabase_userId_idx" ON "NotionDatabase"("userId");

-- CreateIndex
CREATE INDEX "NotionDatabase_databaseId_idx" ON "NotionDatabase"("databaseId");

-- CreateIndex
CREATE UNIQUE INDEX "NotionPage_pageId_key" ON "NotionPage"("pageId");

-- CreateIndex
CREATE INDEX "NotionPage_userId_idx" ON "NotionPage"("userId");

-- CreateIndex
CREATE INDEX "NotionPage_databaseId_idx" ON "NotionPage"("databaseId");

-- CreateIndex
CREATE INDEX "NotionPage_pageId_idx" ON "NotionPage"("pageId");

-- CreateIndex
CREATE INDEX "NotionPage_status_idx" ON "NotionPage"("status");

-- CreateIndex
CREATE INDEX "NotionPage_type_idx" ON "NotionPage"("type");

-- CreateIndex
CREATE INDEX "NotionReport_userId_idx" ON "NotionReport"("userId");

-- CreateIndex
CREATE INDEX "NotionReport_reportName_idx" ON "NotionReport"("reportName");
