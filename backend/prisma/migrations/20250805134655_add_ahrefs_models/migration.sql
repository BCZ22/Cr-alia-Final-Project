-- CreateTable
CREATE TABLE "InstagramComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "commentId" TEXT NOT NULL,
    "postId" TEXT,
    "text" TEXT NOT NULL,
    "fromName" TEXT,
    "fromId" TEXT,
    "timestamp" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TikTokConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "tiktokUserId" TEXT NOT NULL,
    "tiktokUsername" TEXT NOT NULL,
    "displayName" TEXT,
    "profilePicture" TEXT,
    "followerCount" INTEGER,
    "followingCount" INTEGER,
    "videoCount" INTEGER,
    "likeCount" INTEGER,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TikTokConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tiktokConnectionId" INTEGER NOT NULL,
    "videoId" TEXT NOT NULL,
    "shareId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "hashtags" TEXT,
    "musicName" TEXT,
    "musicAuthor" TEXT,
    "duration" INTEGER,
    "videoUrl" TEXT,
    "coverUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "bookmarkCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TikTokVideo_tiktokConnectionId_fkey" FOREIGN KEY ("tiktokConnectionId") REFERENCES "TikTokConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tiktokConnectionId" INTEGER NOT NULL,
    "tiktokVideoId" INTEGER,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "period" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TikTokAnalytics_tiktokConnectionId_fkey" FOREIGN KEY ("tiktokConnectionId") REFERENCES "TikTokConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TikTokAnalytics_tiktokVideoId_fkey" FOREIGN KEY ("tiktokVideoId") REFERENCES "TikTokVideo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokScheduledPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "tiktokConnectionId" INTEGER,
    "videoUrl" TEXT,
    "coverUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "hashtags" TEXT,
    "musicName" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "publishedAt" DATETIME,
    "tiktokVideoId" TEXT,
    "shareId" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TikTokScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TikTokScheduledPost_tiktokConnectionId_fkey" FOREIGN KEY ("tiktokConnectionId") REFERENCES "TikTokConnection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TikTokTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "viewCount" INTEGER,
    "videoCount" INTEGER,
    "trendingScore" REAL,
    "data" TEXT,
    "category" TEXT,
    "trendingAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TikTokScrapedTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "url" TEXT,
    "country" TEXT,
    "niche" TEXT,
    "stats" TEXT,
    "trendingScore" REAL,
    "source" TEXT NOT NULL,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TikTokRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "confidence" REAL,
    "source" TEXT,
    "trendId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TikTokRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TikTokRecommendation_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "TikTokScrapedTrend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkedInScheduledPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "linkedinConnectionId" INTEGER,
    "text" TEXT NOT NULL,
    "imageUrl" TEXT,
    "articleUrl" TEXT,
    "hashtags" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "publishedAt" DATETIME,
    "linkedinPostId" TEXT,
    "permalink" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkedInScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LinkedInScheduledPost_linkedinConnectionId_fkey" FOREIGN KEY ("linkedinConnectionId") REFERENCES "LinkedInConnection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkedInConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "linkedinUserId" TEXT NOT NULL,
    "linkedinUsername" TEXT NOT NULL,
    "displayName" TEXT,
    "profilePicture" TEXT,
    "followerCount" INTEGER,
    "connectionCount" INTEGER,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkedInConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EditorialCalendar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EditorialCalendar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EditorialCalendarItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "calendarId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentType" TEXT NOT NULL,
    "contentStatus" TEXT NOT NULL DEFAULT 'TO_GENERATE',
    "scheduledDate" DATETIME NOT NULL,
    "scheduledTime" TEXT,
    "generatedScript" TEXT,
    "generatedImage" TEXT,
    "generatedHashtags" TEXT,
    "tags" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EditorialCalendarItem_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "EditorialCalendar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkedInPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linkedinConnectionId" INTEGER NOT NULL,
    "linkedinPostId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "hashtags" TEXT,
    "mediaUrls" TEXT,
    "engagement" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LinkedInPost_linkedinConnectionId_fkey" FOREIGN KEY ("linkedinConnectionId") REFERENCES "LinkedInConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LinkedInTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hashtag" TEXT NOT NULL,
    "postCount" INTEGER NOT NULL,
    "engagement" REAL NOT NULL,
    "trendingScore" REAL NOT NULL,
    "category" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PinterestConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "pinterestUserId" TEXT NOT NULL,
    "pinterestUsername" TEXT NOT NULL,
    "displayName" TEXT,
    "profilePicture" TEXT,
    "followerCount" INTEGER,
    "followingCount" INTEGER,
    "boardCount" INTEGER,
    "pinCount" INTEGER,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PinterestConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PinterestPin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pinterestConnectionId" INTEGER NOT NULL,
    "pinId" TEXT NOT NULL,
    "boardId" TEXT,
    "title" TEXT,
    "description" TEXT,
    "link" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "contentType" TEXT NOT NULL,
    "mediaType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "impressionCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "saveCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PinterestPin_pinterestConnectionId_fkey" FOREIGN KEY ("pinterestConnectionId") REFERENCES "PinterestConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PinterestBoard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pinterestConnectionId" INTEGER NOT NULL,
    "boardId" TEXT NOT NULL,
    "boardName" TEXT NOT NULL,
    "boardDescription" TEXT,
    "boardUrl" TEXT,
    "pinCount" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PinterestBoard_pinterestConnectionId_fkey" FOREIGN KEY ("pinterestConnectionId") REFERENCES "PinterestConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PinterestAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pinterestConnectionId" INTEGER NOT NULL,
    "pinterestPinId" INTEGER,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "period" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PinterestAnalytics_pinterestConnectionId_fkey" FOREIGN KEY ("pinterestConnectionId") REFERENCES "PinterestConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PinterestAnalytics_pinterestPinId_fkey" FOREIGN KEY ("pinterestPinId") REFERENCES "PinterestPin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PinterestScheduledPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "pinterestConnectionId" INTEGER,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "link" TEXT,
    "boardId" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "publishedAt" DATETIME,
    "pinterestPinId" TEXT,
    "pinUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PinterestScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PinterestScheduledPost_pinterestConnectionId_fkey" FOREIGN KEY ("pinterestConnectionId") REFERENCES "PinterestConnection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PinterestTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "category" TEXT,
    "niche" TEXT,
    "searchVolume" INTEGER,
    "pinCount" INTEGER,
    "trendingScore" REAL,
    "data" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PinterestRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "confidence" REAL,
    "source" TEXT,
    "trendId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PinterestRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PinterestRecommendation_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "PinterestTrend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelTitle" TEXT NOT NULL,
    "channelDescription" TEXT,
    "channelThumbnail" TEXT,
    "subscriberCount" INTEGER,
    "videoCount" INTEGER,
    "viewCount" INTEGER,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YouTubeConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeConnectionId" INTEGER NOT NULL,
    "videoId" TEXT NOT NULL,
    "playlistId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "categoryId" TEXT,
    "defaultLanguage" TEXT,
    "defaultAudioLanguage" TEXT,
    "duration" TEXT,
    "dimension" TEXT,
    "definition" TEXT,
    "caption" BOOLEAN NOT NULL DEFAULT false,
    "licensedContent" BOOLEAN NOT NULL DEFAULT false,
    "contentRating" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YouTubeVideo_youtubeConnectionId_fkey" FOREIGN KEY ("youtubeConnectionId") REFERENCES "YouTubeConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubePlaylist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeConnectionId" INTEGER NOT NULL,
    "playlistId" TEXT NOT NULL,
    "playlistTitle" TEXT NOT NULL,
    "playlistDescription" TEXT,
    "playlistThumbnail" TEXT,
    "itemCount" INTEGER NOT NULL DEFAULT 0,
    "privacyStatus" TEXT NOT NULL DEFAULT 'private',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YouTubePlaylist_youtubeConnectionId_fkey" FOREIGN KEY ("youtubeConnectionId") REFERENCES "YouTubeConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeConnectionId" INTEGER NOT NULL,
    "youtubeVideoId" INTEGER,
    "commentId" TEXT NOT NULL,
    "authorChannelId" TEXT,
    "authorDisplayName" TEXT NOT NULL,
    "authorProfileImageUrl" TEXT,
    "authorChannelUrl" TEXT,
    "textDisplay" TEXT NOT NULL,
    "textOriginal" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "canRate" BOOLEAN NOT NULL DEFAULT true,
    "viewerRating" TEXT,
    "totalReplyCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    CONSTRAINT "YouTubeComment_youtubeConnectionId_fkey" FOREIGN KEY ("youtubeConnectionId") REFERENCES "YouTubeConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "YouTubeComment_youtubeVideoId_fkey" FOREIGN KEY ("youtubeVideoId") REFERENCES "YouTubeVideo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "youtubeConnectionId" INTEGER NOT NULL,
    "youtubeVideoId" INTEGER,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "period" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "YouTubeAnalytics_youtubeConnectionId_fkey" FOREIGN KEY ("youtubeConnectionId") REFERENCES "YouTubeConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "YouTubeAnalytics_youtubeVideoId_fkey" FOREIGN KEY ("youtubeVideoId") REFERENCES "YouTubeVideo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeScheduledVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "youtubeConnectionId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "categoryId" TEXT,
    "thumbnailUrl" TEXT,
    "videoFile" TEXT,
    "scriptContent" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "youtubeVideoId" TEXT,
    "videoUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YouTubeScheduledVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "YouTubeScheduledVideo_youtubeConnectionId_fkey" FOREIGN KEY ("youtubeConnectionId") REFERENCES "YouTubeConnection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YouTubeTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "regionCode" TEXT,
    "trendingDate" DATETIME,
    "viewCount" INTEGER,
    "likeCount" INTEGER,
    "commentCount" INTEGER,
    "trendingScore" REAL,
    "thumbnailUrl" TEXT,
    "channelTitle" TEXT,
    "channelId" TEXT,
    "videoId" TEXT,
    "data" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "YouTubeRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "confidence" REAL,
    "source" TEXT,
    "trendId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "YouTubeRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "YouTubeRecommendation_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "YouTubeTrend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitterConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "twitterUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "profileImageUrl" TEXT,
    "description" TEXT,
    "location" TEXT,
    "url" TEXT,
    "followersCount" INTEGER,
    "followingCount" INTEGER,
    "tweetCount" INTEGER,
    "listedCount" INTEGER,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TwitterConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitterTweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "twitterConnectionId" INTEGER NOT NULL,
    "tweetId" TEXT NOT NULL,
    "conversationId" TEXT,
    "inReplyToUserId" TEXT,
    "text" TEXT NOT NULL,
    "lang" TEXT,
    "source" TEXT,
    "isRetweet" BOOLEAN NOT NULL DEFAULT false,
    "isQuote" BOOLEAN NOT NULL DEFAULT false,
    "isReply" BOOLEAN NOT NULL DEFAULT false,
    "isThread" BOOLEAN NOT NULL DEFAULT false,
    "threadPosition" INTEGER,
    "mediaUrls" TEXT,
    "mediaTypes" TEXT,
    "retweetCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "replyCount" INTEGER NOT NULL DEFAULT 0,
    "quoteCount" INTEGER NOT NULL DEFAULT 0,
    "impressionCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TwitterTweet_twitterConnectionId_fkey" FOREIGN KEY ("twitterConnectionId") REFERENCES "TwitterConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitterAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "twitterConnectionId" INTEGER NOT NULL,
    "twitterTweetId" INTEGER,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "period" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TwitterAnalytics_twitterConnectionId_fkey" FOREIGN KEY ("twitterConnectionId") REFERENCES "TwitterConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TwitterAnalytics_twitterTweetId_fkey" FOREIGN KEY ("twitterTweetId") REFERENCES "TwitterTweet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitterScheduledTweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "twitterConnectionId" INTEGER,
    "text" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "replyToTweetId" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "tweetId" TEXT,
    "tweetUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TwitterScheduledTweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TwitterScheduledTweet_twitterConnectionId_fkey" FOREIGN KEY ("twitterConnectionId") REFERENCES "TwitterConnection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitterTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "category" TEXT,
    "region" TEXT,
    "language" TEXT,
    "tweetVolume" INTEGER,
    "trendingScore" REAL,
    "data" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TwitterRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "confidence" REAL,
    "source" TEXT,
    "trendId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TwitterRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TwitterRecommendation_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "TwitterTrend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacebookConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "facebookUserId" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "profilePicture" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FacebookConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacebookPage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebookConnectionId" INTEGER NOT NULL,
    "pageId" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "pageUsername" TEXT,
    "pageCategory" TEXT,
    "pageDescription" TEXT,
    "pagePicture" TEXT,
    "pageCover" TEXT,
    "pageFollowers" INTEGER,
    "pageLikes" INTEGER,
    "pageCheckins" INTEGER,
    "accessToken" TEXT NOT NULL,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FacebookPage_facebookConnectionId_fkey" FOREIGN KEY ("facebookConnectionId") REFERENCES "FacebookConnection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacebookPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebookPageId" INTEGER NOT NULL,
    "postId" TEXT NOT NULL,
    "permalink" TEXT,
    "message" TEXT,
    "story" TEXT,
    "type" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "mediaTypes" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "reachCount" INTEGER NOT NULL DEFAULT 0,
    "impressionCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FacebookPost_facebookPageId_fkey" FOREIGN KEY ("facebookPageId") REFERENCES "FacebookPage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacebookAnalytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facebookPageId" INTEGER NOT NULL,
    "facebookPostId" INTEGER,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "period" TEXT,
    "recordedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FacebookAnalytics_facebookPageId_fkey" FOREIGN KEY ("facebookPageId") REFERENCES "FacebookPage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacebookAnalytics_facebookPostId_fkey" FOREIGN KEY ("facebookPostId") REFERENCES "FacebookPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacebookScheduledPost" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "facebookConnectionId" INTEGER,
    "facebookPageId" INTEGER,
    "message" TEXT NOT NULL,
    "mediaUrls" TEXT,
    "link" TEXT,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "publishedAt" DATETIME,
    "postId" TEXT,
    "postUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FacebookScheduledPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacebookScheduledPost_facebookConnectionId_fkey" FOREIGN KEY ("facebookConnectionId") REFERENCES "FacebookConnection" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FacebookScheduledPost_facebookPageId_fkey" FOREIGN KEY ("facebookPageId") REFERENCES "FacebookPage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FacebookTrend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT,
    "category" TEXT,
    "region" TEXT,
    "language" TEXT,
    "engagementScore" REAL,
    "trendingScore" REAL,
    "data" TEXT,
    "scrapedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FacebookRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "content" TEXT,
    "confidence" REAL,
    "source" TEXT,
    "trendId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isApplied" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FacebookRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FacebookRecommendation_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "FacebookTrend" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeneratedImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "enhancedPrompt" TEXT,
    "style" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "localPath" TEXT,
    "platform" TEXT,
    "contentType" TEXT,
    "tags" TEXT,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "scheduledPostId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GeneratedImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GeneratedImage_scheduledPostId_fkey" FOREIGN KEY ("scheduledPostId") REFERENCES "ScheduledPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ImageStyle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "keywords" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ImageFormat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "aspectRatio" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MidjourneyImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "enhancedPrompt" TEXT,
    "style" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "aspectRatio" TEXT NOT NULL,
    "midjourneyId" TEXT,
    "jobId" TEXT,
    "messageId" TEXT,
    "imageUrl" TEXT,
    "thumbnailUrl" TEXT,
    "localPath" TEXT,
    "platform" TEXT,
    "contentType" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "scheduledPostId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MidjourneyImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MidjourneyImage_scheduledPostId_fkey" FOREIGN KEY ("scheduledPostId") REFERENCES "ScheduledPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MidjourneyStyle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "keywords" TEXT,
    "parameters" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "MidjourneyPrompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "basePrompt" TEXT NOT NULL,
    "styleId" INTEGER,
    "parameters" TEXT,
    "aspectRatio" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MidjourneyPrompt_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "MidjourneyStyle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StableDiffusionImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "enhancedPrompt" TEXT,
    "negativePrompt" TEXT,
    "style" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "steps" INTEGER NOT NULL DEFAULT 50,
    "guidanceScale" REAL NOT NULL DEFAULT 7.5,
    "seed" INTEGER,
    "cfgScale" REAL NOT NULL DEFAULT 7.5,
    "imageUrl" TEXT,
    "thumbnailUrl" TEXT,
    "localPath" TEXT,
    "platform" TEXT,
    "contentType" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "scheduledPostId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StableDiffusionImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StableDiffusionImage_scheduledPostId_fkey" FOREIGN KEY ("scheduledPostId") REFERENCES "ScheduledPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StableDiffusionStyle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "negativePrompt" TEXT,
    "keywords" TEXT,
    "defaultSteps" INTEGER NOT NULL DEFAULT 50,
    "defaultGuidance" REAL NOT NULL DEFAULT 7.5,
    "defaultCfgScale" REAL NOT NULL DEFAULT 7.5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StableDiffusionPrompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "basePrompt" TEXT NOT NULL,
    "negativePrompt" TEXT,
    "styleId" INTEGER,
    "defaultWidth" INTEGER NOT NULL DEFAULT 512,
    "defaultHeight" INTEGER NOT NULL DEFAULT 512,
    "defaultSteps" INTEGER NOT NULL DEFAULT 50,
    "defaultGuidance" REAL NOT NULL DEFAULT 7.5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StableDiffusionPrompt_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "StableDiffusionStyle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RunwayVideo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "enhancedPrompt" TEXT,
    "generationType" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 4,
    "fps" INTEGER NOT NULL DEFAULT 24,
    "width" INTEGER NOT NULL DEFAULT 1080,
    "height" INTEGER NOT NULL DEFAULT 1920,
    "seed" INTEGER,
    "inputImageUrl" TEXT,
    "inputVideoUrl" TEXT,
    "inputImagePath" TEXT,
    "inputVideoPath" TEXT,
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "localPath" TEXT,
    "platform" TEXT,
    "contentType" TEXT,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "runwayTaskId" TEXT,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "scheduledPostId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RunwayVideo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RunwayVideo_scheduledPostId_fkey" FOREIGN KEY ("scheduledPostId") REFERENCES "ScheduledPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RunwayVideoStyle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "keywords" TEXT,
    "defaultDuration" INTEGER NOT NULL DEFAULT 4,
    "defaultFps" INTEGER NOT NULL DEFAULT 24,
    "defaultWidth" INTEGER NOT NULL DEFAULT 1080,
    "defaultHeight" INTEGER NOT NULL DEFAULT 1920,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "RunwayVideoPrompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "basePrompt" TEXT NOT NULL,
    "styleId" INTEGER,
    "defaultDuration" INTEGER NOT NULL DEFAULT 4,
    "defaultFps" INTEGER NOT NULL DEFAULT 24,
    "defaultWidth" INTEGER NOT NULL DEFAULT 1080,
    "defaultHeight" INTEGER NOT NULL DEFAULT 1920,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RunwayVideoPrompt_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "RunwayVideoStyle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
CREATE TABLE "CanvaTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "thumbnailUrl" TEXT,
    "variables" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GeneratedDesign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "designUrl" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'png',
    "status" TEXT NOT NULL DEFAULT 'generating',
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GeneratedDesign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GoogleAnalyticsConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GoogleAnalyticsConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GA4Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "propertyId" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GA4Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GA4Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "propertyId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "dateRange" JSONB NOT NULL,
    "metrics" JSONB NOT NULL,
    "dimensions" JSONB NOT NULL,
    "data" JSONB NOT NULL,
    "insights" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GA4Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GA4Insight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportId" INTEGER,
    "insightType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "recommendations" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GA4Insight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GA4Insight_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "GA4Report" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MixpanelEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "distinctId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "properties" JSONB NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MixpanelEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MixpanelUserProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "distinctId" TEXT NOT NULL,
    "profile" JSONB NOT NULL,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MixpanelUserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MixpanelInsight" (
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
    CONSTRAINT "MixpanelInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MixpanelBehaviorReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL,
    "dateRange" JSONB NOT NULL,
    "metrics" JSONB NOT NULL,
    "insights" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MixpanelBehaviorReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotjarUserSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hotjarUserId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "recordingUrl" TEXT,
    "duration" INTEGER,
    "events" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HotjarUserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotjarHeatmap" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hotjarUserId" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "heatmapType" TEXT NOT NULL,
    "heatmapData" JSONB NOT NULL,
    "snapshotUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HotjarHeatmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotjarInsight" (
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
    CONSTRAINT "HotjarInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HotjarBehaviorReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL,
    "dateRange" JSONB NOT NULL,
    "metrics" JSONB NOT NULL,
    "insights" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "HotjarBehaviorReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEMrushKeyword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "keyword" TEXT NOT NULL,
    "domain" TEXT,
    "position" INTEGER,
    "searchVolume" INTEGER,
    "cpc" REAL,
    "competition" REAL,
    "difficulty" REAL,
    "results" INTEGER,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SEMrushKeyword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEMrushDomain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "organicKeywords" INTEGER,
    "organicTraffic" INTEGER,
    "organicCost" INTEGER,
    "backlinks" INTEGER,
    "referringDomains" INTEGER,
    "authority" REAL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SEMrushDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEMrushBacklink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "anchorText" TEXT,
    "authority" REAL,
    "followType" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SEMrushBacklink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEMrushInsight" (
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
    CONSTRAINT "SEMrushInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEMrushReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportType" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "insights" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEMrushReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SEMrushMonitoring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "target" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheck" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alertThreshold" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEMrushMonitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsBacklink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "anchorText" TEXT,
    "domainRating" REAL,
    "ahrefsRank" INTEGER,
    "followType" TEXT,
    "firstSeen" TEXT,
    "lastSeen" TEXT,
    "traffic" INTEGER,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AhrefsBacklink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsReferringDomain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "refDomain" TEXT NOT NULL,
    "domainRating" REAL,
    "ahrefsRank" INTEGER,
    "backlinks" INTEGER,
    "traffic" INTEGER,
    "firstSeen" TEXT,
    "lastSeen" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AhrefsReferringDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsAnchor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "anchorText" TEXT NOT NULL,
    "count" INTEGER,
    "percentage" REAL,
    "domainRating" REAL,
    "traffic" INTEGER,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AhrefsAnchor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsDomain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "domainRating" REAL,
    "ahrefsRank" INTEGER,
    "backlinks" INTEGER,
    "referringDomains" INTEGER,
    "traffic" INTEGER,
    "organicKeywords" INTEGER,
    "organicTraffic" INTEGER,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AhrefsDomain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsCompetitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "competitor" TEXT NOT NULL,
    "domainRating" REAL,
    "ahrefsRank" INTEGER,
    "backlinks" INTEGER,
    "referringDomains" INTEGER,
    "traffic" INTEGER,
    "organicKeywords" INTEGER,
    "overlapScore" REAL,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AhrefsCompetitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsInsight" (
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
    CONSTRAINT "AhrefsInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "insights" JSONB,
    "aiRecommendations" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AhrefsReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AhrefsMonitoring" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "frequency" TEXT NOT NULL DEFAULT 'weekly',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastCheck" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AhrefsMonitoring_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "InstagramComment_commentId_key" ON "InstagramComment"("commentId");

-- CreateIndex
CREATE INDEX "InstagramComment_commentId_idx" ON "InstagramComment"("commentId");

-- CreateIndex
CREATE INDEX "InstagramComment_postId_idx" ON "InstagramComment"("postId");

-- CreateIndex
CREATE INDEX "InstagramComment_timestamp_idx" ON "InstagramComment"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokConnection_tiktokUserId_key" ON "TikTokConnection"("tiktokUserId");

-- CreateIndex
CREATE INDEX "TikTokConnection_userId_idx" ON "TikTokConnection"("userId");

-- CreateIndex
CREATE INDEX "TikTokConnection_tiktokUserId_idx" ON "TikTokConnection"("tiktokUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokVideo_videoId_key" ON "TikTokVideo"("videoId");

-- CreateIndex
CREATE INDEX "TikTokVideo_tiktokConnectionId_idx" ON "TikTokVideo"("tiktokConnectionId");

-- CreateIndex
CREATE INDEX "TikTokVideo_videoId_idx" ON "TikTokVideo"("videoId");

-- CreateIndex
CREATE INDEX "TikTokVideo_publishedAt_idx" ON "TikTokVideo"("publishedAt");

-- CreateIndex
CREATE INDEX "TikTokAnalytics_tiktokConnectionId_idx" ON "TikTokAnalytics"("tiktokConnectionId");

-- CreateIndex
CREATE INDEX "TikTokAnalytics_type_idx" ON "TikTokAnalytics"("type");

-- CreateIndex
CREATE INDEX "TikTokAnalytics_recordedAt_idx" ON "TikTokAnalytics"("recordedAt");

-- CreateIndex
CREATE INDEX "TikTokScheduledPost_userId_idx" ON "TikTokScheduledPost"("userId");

-- CreateIndex
CREATE INDEX "TikTokScheduledPost_scheduledAt_idx" ON "TikTokScheduledPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "TikTokScheduledPost_status_idx" ON "TikTokScheduledPost"("status");

-- CreateIndex
CREATE INDEX "TikTokTrend_type_idx" ON "TikTokTrend"("type");

-- CreateIndex
CREATE INDEX "TikTokTrend_trendingAt_idx" ON "TikTokTrend"("trendingAt");

-- CreateIndex
CREATE INDEX "TikTokTrend_category_idx" ON "TikTokTrend"("category");

-- CreateIndex
CREATE INDEX "TikTokScrapedTrend_type_idx" ON "TikTokScrapedTrend"("type");

-- CreateIndex
CREATE INDEX "TikTokScrapedTrend_country_idx" ON "TikTokScrapedTrend"("country");

-- CreateIndex
CREATE INDEX "TikTokScrapedTrend_niche_idx" ON "TikTokScrapedTrend"("niche");

-- CreateIndex
CREATE INDEX "TikTokScrapedTrend_scrapedAt_idx" ON "TikTokScrapedTrend"("scrapedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokScrapedTrend_name_type_country_key" ON "TikTokScrapedTrend"("name", "type", "country");

-- CreateIndex
CREATE INDEX "TikTokRecommendation_userId_idx" ON "TikTokRecommendation"("userId");

-- CreateIndex
CREATE INDEX "TikTokRecommendation_type_idx" ON "TikTokRecommendation"("type");

-- CreateIndex
CREATE INDEX "TikTokRecommendation_createdAt_idx" ON "TikTokRecommendation"("createdAt");

-- CreateIndex
CREATE INDEX "LinkedInScheduledPost_userId_idx" ON "LinkedInScheduledPost"("userId");

-- CreateIndex
CREATE INDEX "LinkedInScheduledPost_scheduledAt_idx" ON "LinkedInScheduledPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "LinkedInScheduledPost_status_idx" ON "LinkedInScheduledPost"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInConnection_linkedinUserId_key" ON "LinkedInConnection"("linkedinUserId");

-- CreateIndex
CREATE INDEX "LinkedInConnection_userId_idx" ON "LinkedInConnection"("userId");

-- CreateIndex
CREATE INDEX "LinkedInConnection_linkedinUserId_idx" ON "LinkedInConnection"("linkedinUserId");

-- CreateIndex
CREATE INDEX "EditorialCalendar_userId_idx" ON "EditorialCalendar"("userId");

-- CreateIndex
CREATE INDEX "EditorialCalendar_startDate_idx" ON "EditorialCalendar"("startDate");

-- CreateIndex
CREATE INDEX "EditorialCalendar_endDate_idx" ON "EditorialCalendar"("endDate");

-- CreateIndex
CREATE INDEX "EditorialCalendarItem_calendarId_idx" ON "EditorialCalendarItem"("calendarId");

-- CreateIndex
CREATE INDEX "EditorialCalendarItem_scheduledDate_idx" ON "EditorialCalendarItem"("scheduledDate");

-- CreateIndex
CREATE INDEX "EditorialCalendarItem_contentStatus_idx" ON "EditorialCalendarItem"("contentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "LinkedInPost_linkedinPostId_key" ON "LinkedInPost"("linkedinPostId");

-- CreateIndex
CREATE INDEX "LinkedInPost_linkedinConnectionId_idx" ON "LinkedInPost"("linkedinConnectionId");

-- CreateIndex
CREATE INDEX "LinkedInPost_publishedAt_idx" ON "LinkedInPost"("publishedAt");

-- CreateIndex
CREATE INDEX "LinkedInTrend_hashtag_idx" ON "LinkedInTrend"("hashtag");

-- CreateIndex
CREATE INDEX "LinkedInTrend_trendingScore_idx" ON "LinkedInTrend"("trendingScore");

-- CreateIndex
CREATE INDEX "LinkedInTrend_category_idx" ON "LinkedInTrend"("category");

-- CreateIndex
CREATE UNIQUE INDEX "PinterestConnection_pinterestUserId_key" ON "PinterestConnection"("pinterestUserId");

-- CreateIndex
CREATE INDEX "PinterestConnection_userId_idx" ON "PinterestConnection"("userId");

-- CreateIndex
CREATE INDEX "PinterestConnection_pinterestUserId_idx" ON "PinterestConnection"("pinterestUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PinterestPin_pinId_key" ON "PinterestPin"("pinId");

-- CreateIndex
CREATE INDEX "PinterestPin_pinterestConnectionId_idx" ON "PinterestPin"("pinterestConnectionId");

-- CreateIndex
CREATE INDEX "PinterestPin_pinId_idx" ON "PinterestPin"("pinId");

-- CreateIndex
CREATE INDEX "PinterestPin_publishedAt_idx" ON "PinterestPin"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PinterestBoard_boardId_key" ON "PinterestBoard"("boardId");

-- CreateIndex
CREATE INDEX "PinterestBoard_pinterestConnectionId_idx" ON "PinterestBoard"("pinterestConnectionId");

-- CreateIndex
CREATE INDEX "PinterestBoard_boardId_idx" ON "PinterestBoard"("boardId");

-- CreateIndex
CREATE INDEX "PinterestAnalytics_pinterestConnectionId_idx" ON "PinterestAnalytics"("pinterestConnectionId");

-- CreateIndex
CREATE INDEX "PinterestAnalytics_type_idx" ON "PinterestAnalytics"("type");

-- CreateIndex
CREATE INDEX "PinterestAnalytics_recordedAt_idx" ON "PinterestAnalytics"("recordedAt");

-- CreateIndex
CREATE INDEX "PinterestScheduledPost_userId_idx" ON "PinterestScheduledPost"("userId");

-- CreateIndex
CREATE INDEX "PinterestScheduledPost_scheduledAt_idx" ON "PinterestScheduledPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "PinterestScheduledPost_status_idx" ON "PinterestScheduledPost"("status");

-- CreateIndex
CREATE INDEX "PinterestTrend_type_idx" ON "PinterestTrend"("type");

-- CreateIndex
CREATE INDEX "PinterestTrend_category_idx" ON "PinterestTrend"("category");

-- CreateIndex
CREATE INDEX "PinterestTrend_niche_idx" ON "PinterestTrend"("niche");

-- CreateIndex
CREATE INDEX "PinterestTrend_trendingScore_idx" ON "PinterestTrend"("trendingScore");

-- CreateIndex
CREATE INDEX "PinterestRecommendation_userId_idx" ON "PinterestRecommendation"("userId");

-- CreateIndex
CREATE INDEX "PinterestRecommendation_type_idx" ON "PinterestRecommendation"("type");

-- CreateIndex
CREATE INDEX "PinterestRecommendation_createdAt_idx" ON "PinterestRecommendation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeConnection_channelId_key" ON "YouTubeConnection"("channelId");

-- CreateIndex
CREATE INDEX "YouTubeConnection_userId_idx" ON "YouTubeConnection"("userId");

-- CreateIndex
CREATE INDEX "YouTubeConnection_channelId_idx" ON "YouTubeConnection"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeVideo_videoId_key" ON "YouTubeVideo"("videoId");

-- CreateIndex
CREATE INDEX "YouTubeVideo_youtubeConnectionId_idx" ON "YouTubeVideo"("youtubeConnectionId");

-- CreateIndex
CREATE INDEX "YouTubeVideo_videoId_idx" ON "YouTubeVideo"("videoId");

-- CreateIndex
CREATE INDEX "YouTubeVideo_publishedAt_idx" ON "YouTubeVideo"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubePlaylist_playlistId_key" ON "YouTubePlaylist"("playlistId");

-- CreateIndex
CREATE INDEX "YouTubePlaylist_youtubeConnectionId_idx" ON "YouTubePlaylist"("youtubeConnectionId");

-- CreateIndex
CREATE INDEX "YouTubePlaylist_playlistId_idx" ON "YouTubePlaylist"("playlistId");

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeComment_commentId_key" ON "YouTubeComment"("commentId");

-- CreateIndex
CREATE INDEX "YouTubeComment_youtubeConnectionId_idx" ON "YouTubeComment"("youtubeConnectionId");

-- CreateIndex
CREATE INDEX "YouTubeComment_commentId_idx" ON "YouTubeComment"("commentId");

-- CreateIndex
CREATE INDEX "YouTubeComment_publishedAt_idx" ON "YouTubeComment"("publishedAt");

-- CreateIndex
CREATE INDEX "YouTubeAnalytics_youtubeConnectionId_idx" ON "YouTubeAnalytics"("youtubeConnectionId");

-- CreateIndex
CREATE INDEX "YouTubeAnalytics_type_idx" ON "YouTubeAnalytics"("type");

-- CreateIndex
CREATE INDEX "YouTubeAnalytics_recordedAt_idx" ON "YouTubeAnalytics"("recordedAt");

-- CreateIndex
CREATE INDEX "YouTubeScheduledVideo_userId_idx" ON "YouTubeScheduledVideo"("userId");

-- CreateIndex
CREATE INDEX "YouTubeScheduledVideo_scheduledAt_idx" ON "YouTubeScheduledVideo"("scheduledAt");

-- CreateIndex
CREATE INDEX "YouTubeScheduledVideo_status_idx" ON "YouTubeScheduledVideo"("status");

-- CreateIndex
CREATE INDEX "YouTubeTrend_type_idx" ON "YouTubeTrend"("type");

-- CreateIndex
CREATE INDEX "YouTubeTrend_categoryId_idx" ON "YouTubeTrend"("categoryId");

-- CreateIndex
CREATE INDEX "YouTubeTrend_regionCode_idx" ON "YouTubeTrend"("regionCode");

-- CreateIndex
CREATE INDEX "YouTubeTrend_trendingScore_idx" ON "YouTubeTrend"("trendingScore");

-- CreateIndex
CREATE INDEX "YouTubeRecommendation_userId_idx" ON "YouTubeRecommendation"("userId");

-- CreateIndex
CREATE INDEX "YouTubeRecommendation_type_idx" ON "YouTubeRecommendation"("type");

-- CreateIndex
CREATE INDEX "YouTubeRecommendation_createdAt_idx" ON "YouTubeRecommendation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TwitterConnection_twitterUserId_key" ON "TwitterConnection"("twitterUserId");

-- CreateIndex
CREATE INDEX "TwitterConnection_userId_idx" ON "TwitterConnection"("userId");

-- CreateIndex
CREATE INDEX "TwitterConnection_twitterUserId_idx" ON "TwitterConnection"("twitterUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TwitterTweet_tweetId_key" ON "TwitterTweet"("tweetId");

-- CreateIndex
CREATE INDEX "TwitterTweet_twitterConnectionId_idx" ON "TwitterTweet"("twitterConnectionId");

-- CreateIndex
CREATE INDEX "TwitterTweet_tweetId_idx" ON "TwitterTweet"("tweetId");

-- CreateIndex
CREATE INDEX "TwitterTweet_publishedAt_idx" ON "TwitterTweet"("publishedAt");

-- CreateIndex
CREATE INDEX "TwitterAnalytics_twitterConnectionId_idx" ON "TwitterAnalytics"("twitterConnectionId");

-- CreateIndex
CREATE INDEX "TwitterAnalytics_type_idx" ON "TwitterAnalytics"("type");

-- CreateIndex
CREATE INDEX "TwitterAnalytics_recordedAt_idx" ON "TwitterAnalytics"("recordedAt");

-- CreateIndex
CREATE INDEX "TwitterScheduledTweet_userId_idx" ON "TwitterScheduledTweet"("userId");

-- CreateIndex
CREATE INDEX "TwitterScheduledTweet_scheduledAt_idx" ON "TwitterScheduledTweet"("scheduledAt");

-- CreateIndex
CREATE INDEX "TwitterScheduledTweet_status_idx" ON "TwitterScheduledTweet"("status");

-- CreateIndex
CREATE INDEX "TwitterTrend_type_idx" ON "TwitterTrend"("type");

-- CreateIndex
CREATE INDEX "TwitterTrend_category_idx" ON "TwitterTrend"("category");

-- CreateIndex
CREATE INDEX "TwitterTrend_region_idx" ON "TwitterTrend"("region");

-- CreateIndex
CREATE INDEX "TwitterTrend_trendingScore_idx" ON "TwitterTrend"("trendingScore");

-- CreateIndex
CREATE INDEX "TwitterRecommendation_userId_idx" ON "TwitterRecommendation"("userId");

-- CreateIndex
CREATE INDEX "TwitterRecommendation_type_idx" ON "TwitterRecommendation"("type");

-- CreateIndex
CREATE INDEX "TwitterRecommendation_createdAt_idx" ON "TwitterRecommendation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookConnection_facebookUserId_key" ON "FacebookConnection"("facebookUserId");

-- CreateIndex
CREATE INDEX "FacebookConnection_userId_idx" ON "FacebookConnection"("userId");

-- CreateIndex
CREATE INDEX "FacebookConnection_facebookUserId_idx" ON "FacebookConnection"("facebookUserId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPage_pageId_key" ON "FacebookPage"("pageId");

-- CreateIndex
CREATE INDEX "FacebookPage_facebookConnectionId_idx" ON "FacebookPage"("facebookConnectionId");

-- CreateIndex
CREATE INDEX "FacebookPage_pageId_idx" ON "FacebookPage"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookPost_postId_key" ON "FacebookPost"("postId");

-- CreateIndex
CREATE INDEX "FacebookPost_facebookPageId_idx" ON "FacebookPost"("facebookPageId");

-- CreateIndex
CREATE INDEX "FacebookPost_postId_idx" ON "FacebookPost"("postId");

-- CreateIndex
CREATE INDEX "FacebookPost_publishedAt_idx" ON "FacebookPost"("publishedAt");

-- CreateIndex
CREATE INDEX "FacebookAnalytics_facebookPageId_idx" ON "FacebookAnalytics"("facebookPageId");

-- CreateIndex
CREATE INDEX "FacebookAnalytics_type_idx" ON "FacebookAnalytics"("type");

-- CreateIndex
CREATE INDEX "FacebookAnalytics_recordedAt_idx" ON "FacebookAnalytics"("recordedAt");

-- CreateIndex
CREATE INDEX "FacebookScheduledPost_userId_idx" ON "FacebookScheduledPost"("userId");

-- CreateIndex
CREATE INDEX "FacebookScheduledPost_scheduledAt_idx" ON "FacebookScheduledPost"("scheduledAt");

-- CreateIndex
CREATE INDEX "FacebookScheduledPost_status_idx" ON "FacebookScheduledPost"("status");

-- CreateIndex
CREATE INDEX "FacebookTrend_type_idx" ON "FacebookTrend"("type");

-- CreateIndex
CREATE INDEX "FacebookTrend_category_idx" ON "FacebookTrend"("category");

-- CreateIndex
CREATE INDEX "FacebookTrend_region_idx" ON "FacebookTrend"("region");

-- CreateIndex
CREATE INDEX "FacebookTrend_trendingScore_idx" ON "FacebookTrend"("trendingScore");

-- CreateIndex
CREATE INDEX "FacebookRecommendation_userId_idx" ON "FacebookRecommendation"("userId");

-- CreateIndex
CREATE INDEX "FacebookRecommendation_type_idx" ON "FacebookRecommendation"("type");

-- CreateIndex
CREATE INDEX "FacebookRecommendation_createdAt_idx" ON "FacebookRecommendation"("createdAt");

-- CreateIndex
CREATE INDEX "GeneratedImage_userId_idx" ON "GeneratedImage"("userId");

-- CreateIndex
CREATE INDEX "GeneratedImage_platform_idx" ON "GeneratedImage"("platform");

-- CreateIndex
CREATE INDEX "GeneratedImage_style_idx" ON "GeneratedImage"("style");

-- CreateIndex
CREATE INDEX "GeneratedImage_createdAt_idx" ON "GeneratedImage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ImageStyle_name_key" ON "ImageStyle"("name");

-- CreateIndex
CREATE INDEX "ImageStyle_category_idx" ON "ImageStyle"("category");

-- CreateIndex
CREATE INDEX "ImageStyle_popularity_idx" ON "ImageStyle"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFormat_name_key" ON "ImageFormat"("name");

-- CreateIndex
CREATE INDEX "ImageFormat_platform_idx" ON "ImageFormat"("platform");

-- CreateIndex
CREATE INDEX "ImageFormat_contentType_idx" ON "ImageFormat"("contentType");

-- CreateIndex
CREATE INDEX "MidjourneyImage_userId_idx" ON "MidjourneyImage"("userId");

-- CreateIndex
CREATE INDEX "MidjourneyImage_status_idx" ON "MidjourneyImage"("status");

-- CreateIndex
CREATE INDEX "MidjourneyImage_style_idx" ON "MidjourneyImage"("style");

-- CreateIndex
CREATE INDEX "MidjourneyImage_createdAt_idx" ON "MidjourneyImage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MidjourneyStyle_name_key" ON "MidjourneyStyle"("name");

-- CreateIndex
CREATE INDEX "MidjourneyStyle_category_idx" ON "MidjourneyStyle"("category");

-- CreateIndex
CREATE INDEX "MidjourneyStyle_popularity_idx" ON "MidjourneyStyle"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "MidjourneyPrompt_name_key" ON "MidjourneyPrompt"("name");

-- CreateIndex
CREATE INDEX "MidjourneyPrompt_category_idx" ON "MidjourneyPrompt"("category");

-- CreateIndex
CREATE INDEX "MidjourneyPrompt_usageCount_idx" ON "MidjourneyPrompt"("usageCount");

-- CreateIndex
CREATE INDEX "StableDiffusionImage_userId_idx" ON "StableDiffusionImage"("userId");

-- CreateIndex
CREATE INDEX "StableDiffusionImage_status_idx" ON "StableDiffusionImage"("status");

-- CreateIndex
CREATE INDEX "StableDiffusionImage_style_idx" ON "StableDiffusionImage"("style");

-- CreateIndex
CREATE INDEX "StableDiffusionImage_createdAt_idx" ON "StableDiffusionImage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StableDiffusionStyle_name_key" ON "StableDiffusionStyle"("name");

-- CreateIndex
CREATE INDEX "StableDiffusionStyle_category_idx" ON "StableDiffusionStyle"("category");

-- CreateIndex
CREATE INDEX "StableDiffusionStyle_popularity_idx" ON "StableDiffusionStyle"("popularity");

-- CreateIndex
CREATE UNIQUE INDEX "StableDiffusionPrompt_name_key" ON "StableDiffusionPrompt"("name");

-- CreateIndex
CREATE INDEX "StableDiffusionPrompt_category_idx" ON "StableDiffusionPrompt"("category");

-- CreateIndex
CREATE INDEX "StableDiffusionPrompt_usageCount_idx" ON "StableDiffusionPrompt"("usageCount");

-- CreateIndex
CREATE INDEX "RunwayVideo_userId_idx" ON "RunwayVideo"("userId");

-- CreateIndex
CREATE INDEX "RunwayVideo_status_idx" ON "RunwayVideo"("status");

-- CreateIndex
CREATE INDEX "RunwayVideo_generationType_idx" ON "RunwayVideo"("generationType");

-- CreateIndex
CREATE INDEX "RunwayVideo_createdAt_idx" ON "RunwayVideo"("createdAt");

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
CREATE INDEX "CanvaConnection_userId_idx" ON "CanvaConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CanvaConnection_userId_key" ON "CanvaConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CanvaTemplate_templateId_key" ON "CanvaTemplate"("templateId");

-- CreateIndex
CREATE INDEX "CanvaTemplate_category_idx" ON "CanvaTemplate"("category");

-- CreateIndex
CREATE INDEX "GeneratedDesign_userId_idx" ON "GeneratedDesign"("userId");

-- CreateIndex
CREATE INDEX "GeneratedDesign_templateId_idx" ON "GeneratedDesign"("templateId");

-- CreateIndex
CREATE INDEX "GoogleAnalyticsConnection_userId_idx" ON "GoogleAnalyticsConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAnalyticsConnection_userId_key" ON "GoogleAnalyticsConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GA4Property_propertyId_key" ON "GA4Property"("propertyId");

-- CreateIndex
CREATE INDEX "GA4Property_userId_idx" ON "GA4Property"("userId");

-- CreateIndex
CREATE INDEX "GA4Property_propertyId_idx" ON "GA4Property"("propertyId");

-- CreateIndex
CREATE INDEX "GA4Report_userId_idx" ON "GA4Report"("userId");

-- CreateIndex
CREATE INDEX "GA4Report_propertyId_idx" ON "GA4Report"("propertyId");

-- CreateIndex
CREATE INDEX "GA4Insight_userId_idx" ON "GA4Insight"("userId");

-- CreateIndex
CREATE INDEX "GA4Insight_reportId_idx" ON "GA4Insight"("reportId");

-- CreateIndex
CREATE INDEX "MixpanelEvent_userId_idx" ON "MixpanelEvent"("userId");

-- CreateIndex
CREATE INDEX "MixpanelEvent_distinctId_idx" ON "MixpanelEvent"("distinctId");

-- CreateIndex
CREATE INDEX "MixpanelEvent_eventName_idx" ON "MixpanelEvent"("eventName");

-- CreateIndex
CREATE UNIQUE INDEX "MixpanelUserProfile_distinctId_key" ON "MixpanelUserProfile"("distinctId");

-- CreateIndex
CREATE INDEX "MixpanelUserProfile_userId_idx" ON "MixpanelUserProfile"("userId");

-- CreateIndex
CREATE INDEX "MixpanelUserProfile_distinctId_idx" ON "MixpanelUserProfile"("distinctId");

-- CreateIndex
CREATE INDEX "MixpanelInsight_userId_idx" ON "MixpanelInsight"("userId");

-- CreateIndex
CREATE INDEX "MixpanelInsight_insightType_idx" ON "MixpanelInsight"("insightType");

-- CreateIndex
CREATE INDEX "MixpanelBehaviorReport_userId_idx" ON "MixpanelBehaviorReport"("userId");

-- CreateIndex
CREATE INDEX "MixpanelBehaviorReport_reportType_idx" ON "MixpanelBehaviorReport"("reportType");

-- CreateIndex
CREATE INDEX "HotjarUserSession_userId_idx" ON "HotjarUserSession"("userId");

-- CreateIndex
CREATE INDEX "HotjarUserSession_hotjarUserId_idx" ON "HotjarUserSession"("hotjarUserId");

-- CreateIndex
CREATE INDEX "HotjarUserSession_sessionId_idx" ON "HotjarUserSession"("sessionId");

-- CreateIndex
CREATE INDEX "HotjarHeatmap_userId_idx" ON "HotjarHeatmap"("userId");

-- CreateIndex
CREATE INDEX "HotjarHeatmap_hotjarUserId_idx" ON "HotjarHeatmap"("hotjarUserId");

-- CreateIndex
CREATE INDEX "HotjarHeatmap_pageUrl_idx" ON "HotjarHeatmap"("pageUrl");

-- CreateIndex
CREATE INDEX "HotjarInsight_userId_idx" ON "HotjarInsight"("userId");

-- CreateIndex
CREATE INDEX "HotjarInsight_insightType_idx" ON "HotjarInsight"("insightType");

-- CreateIndex
CREATE INDEX "HotjarBehaviorReport_userId_idx" ON "HotjarBehaviorReport"("userId");

-- CreateIndex
CREATE INDEX "HotjarBehaviorReport_reportType_idx" ON "HotjarBehaviorReport"("reportType");

-- CreateIndex
CREATE INDEX "SEMrushKeyword_userId_idx" ON "SEMrushKeyword"("userId");

-- CreateIndex
CREATE INDEX "SEMrushKeyword_keyword_idx" ON "SEMrushKeyword"("keyword");

-- CreateIndex
CREATE INDEX "SEMrushKeyword_domain_idx" ON "SEMrushKeyword"("domain");

-- CreateIndex
CREATE INDEX "SEMrushDomain_userId_idx" ON "SEMrushDomain"("userId");

-- CreateIndex
CREATE INDEX "SEMrushDomain_domain_idx" ON "SEMrushDomain"("domain");

-- CreateIndex
CREATE INDEX "SEMrushBacklink_userId_idx" ON "SEMrushBacklink"("userId");

-- CreateIndex
CREATE INDEX "SEMrushBacklink_domain_idx" ON "SEMrushBacklink"("domain");

-- CreateIndex
CREATE INDEX "SEMrushBacklink_sourceUrl_idx" ON "SEMrushBacklink"("sourceUrl");

-- CreateIndex
CREATE INDEX "SEMrushInsight_userId_idx" ON "SEMrushInsight"("userId");

-- CreateIndex
CREATE INDEX "SEMrushInsight_insightType_idx" ON "SEMrushInsight"("insightType");

-- CreateIndex
CREATE INDEX "SEMrushReport_userId_idx" ON "SEMrushReport"("userId");

-- CreateIndex
CREATE INDEX "SEMrushReport_reportType_idx" ON "SEMrushReport"("reportType");

-- CreateIndex
CREATE INDEX "SEMrushMonitoring_userId_idx" ON "SEMrushMonitoring"("userId");

-- CreateIndex
CREATE INDEX "SEMrushMonitoring_target_idx" ON "SEMrushMonitoring"("target");

-- CreateIndex
CREATE INDEX "SEMrushMonitoring_targetType_idx" ON "SEMrushMonitoring"("targetType");

-- CreateIndex
CREATE INDEX "AhrefsBacklink_userId_idx" ON "AhrefsBacklink"("userId");

-- CreateIndex
CREATE INDEX "AhrefsBacklink_domain_idx" ON "AhrefsBacklink"("domain");

-- CreateIndex
CREATE INDEX "AhrefsBacklink_sourceUrl_idx" ON "AhrefsBacklink"("sourceUrl");

-- CreateIndex
CREATE INDEX "AhrefsReferringDomain_userId_idx" ON "AhrefsReferringDomain"("userId");

-- CreateIndex
CREATE INDEX "AhrefsReferringDomain_domain_idx" ON "AhrefsReferringDomain"("domain");

-- CreateIndex
CREATE INDEX "AhrefsReferringDomain_refDomain_idx" ON "AhrefsReferringDomain"("refDomain");

-- CreateIndex
CREATE INDEX "AhrefsAnchor_userId_idx" ON "AhrefsAnchor"("userId");

-- CreateIndex
CREATE INDEX "AhrefsAnchor_domain_idx" ON "AhrefsAnchor"("domain");

-- CreateIndex
CREATE INDEX "AhrefsAnchor_anchorText_idx" ON "AhrefsAnchor"("anchorText");

-- CreateIndex
CREATE INDEX "AhrefsDomain_userId_idx" ON "AhrefsDomain"("userId");

-- CreateIndex
CREATE INDEX "AhrefsDomain_domain_idx" ON "AhrefsDomain"("domain");

-- CreateIndex
CREATE INDEX "AhrefsCompetitor_userId_idx" ON "AhrefsCompetitor"("userId");

-- CreateIndex
CREATE INDEX "AhrefsCompetitor_domain_idx" ON "AhrefsCompetitor"("domain");

-- CreateIndex
CREATE INDEX "AhrefsCompetitor_competitor_idx" ON "AhrefsCompetitor"("competitor");

-- CreateIndex
CREATE INDEX "AhrefsInsight_userId_idx" ON "AhrefsInsight"("userId");

-- CreateIndex
CREATE INDEX "AhrefsInsight_insightType_idx" ON "AhrefsInsight"("insightType");

-- CreateIndex
CREATE INDEX "AhrefsReport_userId_idx" ON "AhrefsReport"("userId");

-- CreateIndex
CREATE INDEX "AhrefsReport_reportType_idx" ON "AhrefsReport"("reportType");

-- CreateIndex
CREATE INDEX "AhrefsReport_target_idx" ON "AhrefsReport"("target");

-- CreateIndex
CREATE INDEX "AhrefsMonitoring_userId_idx" ON "AhrefsMonitoring"("userId");

-- CreateIndex
CREATE INDEX "AhrefsMonitoring_domain_idx" ON "AhrefsMonitoring"("domain");

-- CreateIndex
CREATE INDEX "AhrefsMonitoring_reportType_idx" ON "AhrefsMonitoring"("reportType");
