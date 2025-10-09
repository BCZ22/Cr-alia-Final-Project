/*
  Warnings:

  - You are about to drop the `AhrefsAnchor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsBacklink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsCompetitor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsDomain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsMonitoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsReferringDomain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AhrefsReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoInfluencer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoMonitoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoTopic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BuzzSumoTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CanvaConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CanvaTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EditorialCalendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EditorialCalendarItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookScheduledPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacebookTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GA4Insight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GA4Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GA4Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneratedDesign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneratedImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GoogleAnalyticsConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotjarBehaviorReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotjarHeatmap` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotjarInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotjarUserSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageFormat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InstagramComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkedInConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkedInPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkedInScheduledPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkedInTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MidjourneyImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MidjourneyPrompt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MidjourneyStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MixpanelBehaviorReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MixpanelEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MixpanelInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MixpanelUserProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotionDatabase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotionPage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotionReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestBoard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestPin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestScheduledPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PinterestTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RunwayVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RunwayVideoPrompt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RunwayVideoStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEMrushBacklink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEMrushDomain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEMrushInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEMrushKeyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEMrushMonitoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SEMrushReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduledPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialBladeChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialBladeComparison` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialBladeInsight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialBladeMonitoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialBladeReport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SocialBladeStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StableDiffusionImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StableDiffusionPrompt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StableDiffusionStyle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokScheduledPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokScrapedTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TikTokVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitterAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitterConnection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitterRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitterScheduledTweet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitterTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwitterTweet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubeAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubeComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubePlaylist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubeRecommendation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubeScheduledVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubeTrend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `YouTubeVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lastUsed` on the `InstagramConnection` table. All the data in the column will be lost.
  - You are about to drop the column `stripeId` on the `Payment` table. All the data in the column will be lost.
  - You are about to alter the column `engagement` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `String` to `Float`.
  - You are about to drop the column `channelDescription` on the `YouTubeConnection` table. All the data in the column will be lost.
  - You are about to drop the column `channelThumbnail` on the `YouTubeConnection` table. All the data in the column will be lost.
  - You are about to drop the column `channelTitle` on the `YouTubeConnection` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsed` on the `YouTubeConnection` table. All the data in the column will be lost.
  - You are about to drop the column `videoCount` on the `YouTubeConnection` table. All the data in the column will be lost.
  - You are about to drop the column `viewCount` on the `YouTubeConnection` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `content` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Post` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelName` to the `YouTubeConnection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AhrefsAnchor_anchorText_idx";

-- DropIndex
DROP INDEX "AhrefsAnchor_domain_idx";

-- DropIndex
DROP INDEX "AhrefsAnchor_userId_idx";

-- DropIndex
DROP INDEX "AhrefsBacklink_sourceUrl_idx";

-- DropIndex
DROP INDEX "AhrefsBacklink_domain_idx";

-- DropIndex
DROP INDEX "AhrefsBacklink_userId_idx";

-- DropIndex
DROP INDEX "AhrefsCompetitor_competitor_idx";

-- DropIndex
DROP INDEX "AhrefsCompetitor_domain_idx";

-- DropIndex
DROP INDEX "AhrefsCompetitor_userId_idx";

-- DropIndex
DROP INDEX "AhrefsDomain_domain_idx";

-- DropIndex
DROP INDEX "AhrefsDomain_userId_idx";

-- DropIndex
DROP INDEX "AhrefsInsight_insightType_idx";

-- DropIndex
DROP INDEX "AhrefsInsight_userId_idx";

-- DropIndex
DROP INDEX "AhrefsMonitoring_reportType_idx";

-- DropIndex
DROP INDEX "AhrefsMonitoring_domain_idx";

-- DropIndex
DROP INDEX "AhrefsMonitoring_userId_idx";

-- DropIndex
DROP INDEX "AhrefsReferringDomain_refDomain_idx";

-- DropIndex
DROP INDEX "AhrefsReferringDomain_domain_idx";

-- DropIndex
DROP INDEX "AhrefsReferringDomain_userId_idx";

-- DropIndex
DROP INDEX "AhrefsReport_target_idx";

-- DropIndex
DROP INDEX "AhrefsReport_reportType_idx";

-- DropIndex
DROP INDEX "AhrefsReport_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoContent_domain_idx";

-- DropIndex
DROP INDEX "BuzzSumoContent_query_idx";

-- DropIndex
DROP INDEX "BuzzSumoContent_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoInfluencer_domain_idx";

-- DropIndex
DROP INDEX "BuzzSumoInfluencer_name_idx";

-- DropIndex
DROP INDEX "BuzzSumoInfluencer_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoInsight_insightType_idx";

-- DropIndex
DROP INDEX "BuzzSumoInsight_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoMonitoring_reportType_idx";

-- DropIndex
DROP INDEX "BuzzSumoMonitoring_topic_idx";

-- DropIndex
DROP INDEX "BuzzSumoMonitoring_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoReport_query_idx";

-- DropIndex
DROP INDEX "BuzzSumoReport_reportType_idx";

-- DropIndex
DROP INDEX "BuzzSumoReport_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoTopic_country_idx";

-- DropIndex
DROP INDEX "BuzzSumoTopic_topic_idx";

-- DropIndex
DROP INDEX "BuzzSumoTopic_userId_idx";

-- DropIndex
DROP INDEX "BuzzSumoTrend_country_idx";

-- DropIndex
DROP INDEX "BuzzSumoTrend_keyword_idx";

-- DropIndex
DROP INDEX "BuzzSumoTrend_userId_idx";

-- DropIndex
DROP INDEX "CanvaConnection_userId_key";

-- DropIndex
DROP INDEX "CanvaConnection_userId_idx";

-- DropIndex
DROP INDEX "CanvaTemplate_category_idx";

-- DropIndex
DROP INDEX "CanvaTemplate_templateId_key";

-- DropIndex
DROP INDEX "EditorialCalendar_endDate_idx";

-- DropIndex
DROP INDEX "EditorialCalendar_startDate_idx";

-- DropIndex
DROP INDEX "EditorialCalendar_userId_idx";

-- DropIndex
DROP INDEX "EditorialCalendarItem_contentStatus_idx";

-- DropIndex
DROP INDEX "EditorialCalendarItem_scheduledDate_idx";

-- DropIndex
DROP INDEX "EditorialCalendarItem_calendarId_idx";

-- DropIndex
DROP INDEX "FacebookAnalytics_recordedAt_idx";

-- DropIndex
DROP INDEX "FacebookAnalytics_type_idx";

-- DropIndex
DROP INDEX "FacebookAnalytics_facebookPageId_idx";

-- DropIndex
DROP INDEX "FacebookConnection_facebookUserId_idx";

-- DropIndex
DROP INDEX "FacebookConnection_userId_idx";

-- DropIndex
DROP INDEX "FacebookConnection_facebookUserId_key";

-- DropIndex
DROP INDEX "FacebookPage_pageId_idx";

-- DropIndex
DROP INDEX "FacebookPage_facebookConnectionId_idx";

-- DropIndex
DROP INDEX "FacebookPage_pageId_key";

-- DropIndex
DROP INDEX "FacebookPost_publishedAt_idx";

-- DropIndex
DROP INDEX "FacebookPost_postId_idx";

-- DropIndex
DROP INDEX "FacebookPost_facebookPageId_idx";

-- DropIndex
DROP INDEX "FacebookPost_postId_key";

-- DropIndex
DROP INDEX "FacebookRecommendation_createdAt_idx";

-- DropIndex
DROP INDEX "FacebookRecommendation_type_idx";

-- DropIndex
DROP INDEX "FacebookRecommendation_userId_idx";

-- DropIndex
DROP INDEX "FacebookScheduledPost_status_idx";

-- DropIndex
DROP INDEX "FacebookScheduledPost_scheduledAt_idx";

-- DropIndex
DROP INDEX "FacebookScheduledPost_userId_idx";

-- DropIndex
DROP INDEX "FacebookTrend_trendingScore_idx";

-- DropIndex
DROP INDEX "FacebookTrend_region_idx";

-- DropIndex
DROP INDEX "FacebookTrend_category_idx";

-- DropIndex
DROP INDEX "FacebookTrend_type_idx";

-- DropIndex
DROP INDEX "GA4Insight_reportId_idx";

-- DropIndex
DROP INDEX "GA4Insight_userId_idx";

-- DropIndex
DROP INDEX "GA4Property_propertyId_idx";

-- DropIndex
DROP INDEX "GA4Property_userId_idx";

-- DropIndex
DROP INDEX "GA4Property_propertyId_key";

-- DropIndex
DROP INDEX "GA4Report_propertyId_idx";

-- DropIndex
DROP INDEX "GA4Report_userId_idx";

-- DropIndex
DROP INDEX "GeneratedDesign_templateId_idx";

-- DropIndex
DROP INDEX "GeneratedDesign_userId_idx";

-- DropIndex
DROP INDEX "GeneratedImage_createdAt_idx";

-- DropIndex
DROP INDEX "GeneratedImage_style_idx";

-- DropIndex
DROP INDEX "GeneratedImage_platform_idx";

-- DropIndex
DROP INDEX "GeneratedImage_userId_idx";

-- DropIndex
DROP INDEX "GoogleAnalyticsConnection_userId_key";

-- DropIndex
DROP INDEX "GoogleAnalyticsConnection_userId_idx";

-- DropIndex
DROP INDEX "HotjarBehaviorReport_reportType_idx";

-- DropIndex
DROP INDEX "HotjarBehaviorReport_userId_idx";

-- DropIndex
DROP INDEX "HotjarHeatmap_pageUrl_idx";

-- DropIndex
DROP INDEX "HotjarHeatmap_hotjarUserId_idx";

-- DropIndex
DROP INDEX "HotjarHeatmap_userId_idx";

-- DropIndex
DROP INDEX "HotjarInsight_insightType_idx";

-- DropIndex
DROP INDEX "HotjarInsight_userId_idx";

-- DropIndex
DROP INDEX "HotjarUserSession_sessionId_idx";

-- DropIndex
DROP INDEX "HotjarUserSession_hotjarUserId_idx";

-- DropIndex
DROP INDEX "HotjarUserSession_userId_idx";

-- DropIndex
DROP INDEX "ImageFormat_contentType_idx";

-- DropIndex
DROP INDEX "ImageFormat_platform_idx";

-- DropIndex
DROP INDEX "ImageFormat_name_key";

-- DropIndex
DROP INDEX "ImageStyle_popularity_idx";

-- DropIndex
DROP INDEX "ImageStyle_category_idx";

-- DropIndex
DROP INDEX "ImageStyle_name_key";

-- DropIndex
DROP INDEX "InstagramComment_timestamp_idx";

-- DropIndex
DROP INDEX "InstagramComment_postId_idx";

-- DropIndex
DROP INDEX "InstagramComment_commentId_idx";

-- DropIndex
DROP INDEX "InstagramComment_commentId_key";

-- DropIndex
DROP INDEX "LinkedInConnection_linkedinUserId_idx";

-- DropIndex
DROP INDEX "LinkedInConnection_userId_idx";

-- DropIndex
DROP INDEX "LinkedInConnection_linkedinUserId_key";

-- DropIndex
DROP INDEX "LinkedInPost_publishedAt_idx";

-- DropIndex
DROP INDEX "LinkedInPost_linkedinConnectionId_idx";

-- DropIndex
DROP INDEX "LinkedInPost_linkedinPostId_key";

-- DropIndex
DROP INDEX "LinkedInScheduledPost_status_idx";

-- DropIndex
DROP INDEX "LinkedInScheduledPost_scheduledAt_idx";

-- DropIndex
DROP INDEX "LinkedInScheduledPost_userId_idx";

-- DropIndex
DROP INDEX "LinkedInTrend_category_idx";

-- DropIndex
DROP INDEX "LinkedInTrend_trendingScore_idx";

-- DropIndex
DROP INDEX "LinkedInTrend_hashtag_idx";

-- DropIndex
DROP INDEX "MidjourneyImage_createdAt_idx";

-- DropIndex
DROP INDEX "MidjourneyImage_style_idx";

-- DropIndex
DROP INDEX "MidjourneyImage_status_idx";

-- DropIndex
DROP INDEX "MidjourneyImage_userId_idx";

-- DropIndex
DROP INDEX "MidjourneyPrompt_usageCount_idx";

-- DropIndex
DROP INDEX "MidjourneyPrompt_category_idx";

-- DropIndex
DROP INDEX "MidjourneyPrompt_name_key";

-- DropIndex
DROP INDEX "MidjourneyStyle_popularity_idx";

-- DropIndex
DROP INDEX "MidjourneyStyle_category_idx";

-- DropIndex
DROP INDEX "MidjourneyStyle_name_key";

-- DropIndex
DROP INDEX "MixpanelBehaviorReport_reportType_idx";

-- DropIndex
DROP INDEX "MixpanelBehaviorReport_userId_idx";

-- DropIndex
DROP INDEX "MixpanelEvent_eventName_idx";

-- DropIndex
DROP INDEX "MixpanelEvent_distinctId_idx";

-- DropIndex
DROP INDEX "MixpanelEvent_userId_idx";

-- DropIndex
DROP INDEX "MixpanelInsight_insightType_idx";

-- DropIndex
DROP INDEX "MixpanelInsight_userId_idx";

-- DropIndex
DROP INDEX "MixpanelUserProfile_distinctId_idx";

-- DropIndex
DROP INDEX "MixpanelUserProfile_userId_idx";

-- DropIndex
DROP INDEX "MixpanelUserProfile_distinctId_key";

-- DropIndex
DROP INDEX "NotionDatabase_databaseId_idx";

-- DropIndex
DROP INDEX "NotionDatabase_userId_idx";

-- DropIndex
DROP INDEX "NotionDatabase_databaseId_key";

-- DropIndex
DROP INDEX "NotionPage_type_idx";

-- DropIndex
DROP INDEX "NotionPage_status_idx";

-- DropIndex
DROP INDEX "NotionPage_pageId_idx";

-- DropIndex
DROP INDEX "NotionPage_databaseId_idx";

-- DropIndex
DROP INDEX "NotionPage_userId_idx";

-- DropIndex
DROP INDEX "NotionPage_pageId_key";

-- DropIndex
DROP INDEX "NotionReport_reportName_idx";

-- DropIndex
DROP INDEX "NotionReport_userId_idx";

-- DropIndex
DROP INDEX "PinterestAnalytics_recordedAt_idx";

-- DropIndex
DROP INDEX "PinterestAnalytics_type_idx";

-- DropIndex
DROP INDEX "PinterestAnalytics_pinterestConnectionId_idx";

-- DropIndex
DROP INDEX "PinterestBoard_boardId_idx";

-- DropIndex
DROP INDEX "PinterestBoard_pinterestConnectionId_idx";

-- DropIndex
DROP INDEX "PinterestBoard_boardId_key";

-- DropIndex
DROP INDEX "PinterestConnection_pinterestUserId_idx";

-- DropIndex
DROP INDEX "PinterestConnection_userId_idx";

-- DropIndex
DROP INDEX "PinterestConnection_pinterestUserId_key";

-- DropIndex
DROP INDEX "PinterestPin_publishedAt_idx";

-- DropIndex
DROP INDEX "PinterestPin_pinId_idx";

-- DropIndex
DROP INDEX "PinterestPin_pinterestConnectionId_idx";

-- DropIndex
DROP INDEX "PinterestPin_pinId_key";

-- DropIndex
DROP INDEX "PinterestRecommendation_createdAt_idx";

-- DropIndex
DROP INDEX "PinterestRecommendation_type_idx";

-- DropIndex
DROP INDEX "PinterestRecommendation_userId_idx";

-- DropIndex
DROP INDEX "PinterestScheduledPost_status_idx";

-- DropIndex
DROP INDEX "PinterestScheduledPost_scheduledAt_idx";

-- DropIndex
DROP INDEX "PinterestScheduledPost_userId_idx";

-- DropIndex
DROP INDEX "PinterestTrend_trendingScore_idx";

-- DropIndex
DROP INDEX "PinterestTrend_niche_idx";

-- DropIndex
DROP INDEX "PinterestTrend_category_idx";

-- DropIndex
DROP INDEX "PinterestTrend_type_idx";

-- DropIndex
DROP INDEX "RunwayVideo_createdAt_idx";

-- DropIndex
DROP INDEX "RunwayVideo_generationType_idx";

-- DropIndex
DROP INDEX "RunwayVideo_status_idx";

-- DropIndex
DROP INDEX "RunwayVideo_userId_idx";

-- DropIndex
DROP INDEX "RunwayVideoPrompt_usageCount_idx";

-- DropIndex
DROP INDEX "RunwayVideoPrompt_category_idx";

-- DropIndex
DROP INDEX "RunwayVideoPrompt_name_key";

-- DropIndex
DROP INDEX "RunwayVideoStyle_popularity_idx";

-- DropIndex
DROP INDEX "RunwayVideoStyle_category_idx";

-- DropIndex
DROP INDEX "RunwayVideoStyle_name_key";

-- DropIndex
DROP INDEX "SEMrushBacklink_sourceUrl_idx";

-- DropIndex
DROP INDEX "SEMrushBacklink_domain_idx";

-- DropIndex
DROP INDEX "SEMrushBacklink_userId_idx";

-- DropIndex
DROP INDEX "SEMrushDomain_domain_idx";

-- DropIndex
DROP INDEX "SEMrushDomain_userId_idx";

-- DropIndex
DROP INDEX "SEMrushInsight_insightType_idx";

-- DropIndex
DROP INDEX "SEMrushInsight_userId_idx";

-- DropIndex
DROP INDEX "SEMrushKeyword_domain_idx";

-- DropIndex
DROP INDEX "SEMrushKeyword_keyword_idx";

-- DropIndex
DROP INDEX "SEMrushKeyword_userId_idx";

-- DropIndex
DROP INDEX "SEMrushMonitoring_targetType_idx";

-- DropIndex
DROP INDEX "SEMrushMonitoring_target_idx";

-- DropIndex
DROP INDEX "SEMrushMonitoring_userId_idx";

-- DropIndex
DROP INDEX "SEMrushReport_reportType_idx";

-- DropIndex
DROP INDEX "SEMrushReport_userId_idx";

-- DropIndex
DROP INDEX "ScheduledPost_status_idx";

-- DropIndex
DROP INDEX "ScheduledPost_scheduledAt_idx";

-- DropIndex
DROP INDEX "ScheduledPost_userId_idx";

-- DropIndex
DROP INDEX "SocialBladeChannel_platform_idx";

-- DropIndex
DROP INDEX "SocialBladeChannel_channelId_idx";

-- DropIndex
DROP INDEX "SocialBladeChannel_userId_idx";

-- DropIndex
DROP INDEX "SocialBladeComparison_channel2Id_idx";

-- DropIndex
DROP INDEX "SocialBladeComparison_channel1Id_idx";

-- DropIndex
DROP INDEX "SocialBladeComparison_userId_idx";

-- DropIndex
DROP INDEX "SocialBladeInsight_insightType_idx";

-- DropIndex
DROP INDEX "SocialBladeInsight_userId_idx";

-- DropIndex
DROP INDEX "SocialBladeMonitoring_platform_idx";

-- DropIndex
DROP INDEX "SocialBladeMonitoring_channelUrl_idx";

-- DropIndex
DROP INDEX "SocialBladeMonitoring_userId_idx";

-- DropIndex
DROP INDEX "SocialBladeReport_platform_idx";

-- DropIndex
DROP INDEX "SocialBladeReport_reportType_idx";

-- DropIndex
DROP INDEX "SocialBladeReport_userId_idx";

-- DropIndex
DROP INDEX "SocialBladeStats_platform_idx";

-- DropIndex
DROP INDEX "SocialBladeStats_channelId_idx";

-- DropIndex
DROP INDEX "SocialBladeStats_userId_idx";

-- DropIndex
DROP INDEX "StableDiffusionImage_createdAt_idx";

-- DropIndex
DROP INDEX "StableDiffusionImage_style_idx";

-- DropIndex
DROP INDEX "StableDiffusionImage_status_idx";

-- DropIndex
DROP INDEX "StableDiffusionImage_userId_idx";

-- DropIndex
DROP INDEX "StableDiffusionPrompt_usageCount_idx";

-- DropIndex
DROP INDEX "StableDiffusionPrompt_category_idx";

-- DropIndex
DROP INDEX "StableDiffusionPrompt_name_key";

-- DropIndex
DROP INDEX "StableDiffusionStyle_popularity_idx";

-- DropIndex
DROP INDEX "StableDiffusionStyle_category_idx";

-- DropIndex
DROP INDEX "StableDiffusionStyle_name_key";

-- DropIndex
DROP INDEX "TikTokAnalytics_recordedAt_idx";

-- DropIndex
DROP INDEX "TikTokAnalytics_type_idx";

-- DropIndex
DROP INDEX "TikTokAnalytics_tiktokConnectionId_idx";

-- DropIndex
DROP INDEX "TikTokConnection_tiktokUserId_idx";

-- DropIndex
DROP INDEX "TikTokConnection_userId_idx";

-- DropIndex
DROP INDEX "TikTokConnection_tiktokUserId_key";

-- DropIndex
DROP INDEX "TikTokRecommendation_createdAt_idx";

-- DropIndex
DROP INDEX "TikTokRecommendation_type_idx";

-- DropIndex
DROP INDEX "TikTokRecommendation_userId_idx";

-- DropIndex
DROP INDEX "TikTokScheduledPost_status_idx";

-- DropIndex
DROP INDEX "TikTokScheduledPost_scheduledAt_idx";

-- DropIndex
DROP INDEX "TikTokScheduledPost_userId_idx";

-- DropIndex
DROP INDEX "TikTokScrapedTrend_name_type_country_key";

-- DropIndex
DROP INDEX "TikTokScrapedTrend_scrapedAt_idx";

-- DropIndex
DROP INDEX "TikTokScrapedTrend_niche_idx";

-- DropIndex
DROP INDEX "TikTokScrapedTrend_country_idx";

-- DropIndex
DROP INDEX "TikTokScrapedTrend_type_idx";

-- DropIndex
DROP INDEX "TikTokTrend_category_idx";

-- DropIndex
DROP INDEX "TikTokTrend_trendingAt_idx";

-- DropIndex
DROP INDEX "TikTokTrend_type_idx";

-- DropIndex
DROP INDEX "TikTokVideo_publishedAt_idx";

-- DropIndex
DROP INDEX "TikTokVideo_videoId_idx";

-- DropIndex
DROP INDEX "TikTokVideo_tiktokConnectionId_idx";

-- DropIndex
DROP INDEX "TikTokVideo_videoId_key";

-- DropIndex
DROP INDEX "TwitterAnalytics_recordedAt_idx";

-- DropIndex
DROP INDEX "TwitterAnalytics_type_idx";

-- DropIndex
DROP INDEX "TwitterAnalytics_twitterConnectionId_idx";

-- DropIndex
DROP INDEX "TwitterConnection_twitterUserId_idx";

-- DropIndex
DROP INDEX "TwitterConnection_userId_idx";

-- DropIndex
DROP INDEX "TwitterConnection_twitterUserId_key";

-- DropIndex
DROP INDEX "TwitterRecommendation_createdAt_idx";

-- DropIndex
DROP INDEX "TwitterRecommendation_type_idx";

-- DropIndex
DROP INDEX "TwitterRecommendation_userId_idx";

-- DropIndex
DROP INDEX "TwitterScheduledTweet_status_idx";

-- DropIndex
DROP INDEX "TwitterScheduledTweet_scheduledAt_idx";

-- DropIndex
DROP INDEX "TwitterScheduledTweet_userId_idx";

-- DropIndex
DROP INDEX "TwitterTrend_trendingScore_idx";

-- DropIndex
DROP INDEX "TwitterTrend_region_idx";

-- DropIndex
DROP INDEX "TwitterTrend_category_idx";

-- DropIndex
DROP INDEX "TwitterTrend_type_idx";

-- DropIndex
DROP INDEX "TwitterTweet_publishedAt_idx";

-- DropIndex
DROP INDEX "TwitterTweet_tweetId_idx";

-- DropIndex
DROP INDEX "TwitterTweet_twitterConnectionId_idx";

-- DropIndex
DROP INDEX "TwitterTweet_tweetId_key";

-- DropIndex
DROP INDEX "YouTubeAnalytics_recordedAt_idx";

-- DropIndex
DROP INDEX "YouTubeAnalytics_type_idx";

-- DropIndex
DROP INDEX "YouTubeAnalytics_youtubeConnectionId_idx";

-- DropIndex
DROP INDEX "YouTubeComment_publishedAt_idx";

-- DropIndex
DROP INDEX "YouTubeComment_commentId_idx";

-- DropIndex
DROP INDEX "YouTubeComment_youtubeConnectionId_idx";

-- DropIndex
DROP INDEX "YouTubeComment_commentId_key";

-- DropIndex
DROP INDEX "YouTubePlaylist_playlistId_idx";

-- DropIndex
DROP INDEX "YouTubePlaylist_youtubeConnectionId_idx";

-- DropIndex
DROP INDEX "YouTubePlaylist_playlistId_key";

-- DropIndex
DROP INDEX "YouTubeRecommendation_createdAt_idx";

-- DropIndex
DROP INDEX "YouTubeRecommendation_type_idx";

-- DropIndex
DROP INDEX "YouTubeRecommendation_userId_idx";

-- DropIndex
DROP INDEX "YouTubeScheduledVideo_status_idx";

-- DropIndex
DROP INDEX "YouTubeScheduledVideo_scheduledAt_idx";

-- DropIndex
DROP INDEX "YouTubeScheduledVideo_userId_idx";

-- DropIndex
DROP INDEX "YouTubeTrend_trendingScore_idx";

-- DropIndex
DROP INDEX "YouTubeTrend_regionCode_idx";

-- DropIndex
DROP INDEX "YouTubeTrend_categoryId_idx";

-- DropIndex
DROP INDEX "YouTubeTrend_type_idx";

-- DropIndex
DROP INDEX "YouTubeVideo_publishedAt_idx";

-- DropIndex
DROP INDEX "YouTubeVideo_videoId_idx";

-- DropIndex
DROP INDEX "YouTubeVideo_youtubeConnectionId_idx";

-- DropIndex
DROP INDEX "YouTubeVideo_videoId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsAnchor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsBacklink";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsCompetitor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsDomain";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsInsight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsMonitoring";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsReferringDomain";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AhrefsReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoContent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoInfluencer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoInsight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoMonitoring";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoTopic";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BuzzSumoTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CanvaConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CanvaTemplate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EditorialCalendar";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "EditorialCalendarItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookAnalytics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookPage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookRecommendation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookScheduledPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FacebookTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GA4Insight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GA4Property";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GA4Report";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GeneratedDesign";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GeneratedImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GoogleAnalyticsConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HotjarBehaviorReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HotjarHeatmap";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HotjarInsight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HotjarUserSession";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ImageFormat";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ImageStyle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "InstagramComment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LinkedInConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LinkedInPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LinkedInScheduledPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LinkedInTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MidjourneyImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MidjourneyPrompt";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MidjourneyStyle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MixpanelBehaviorReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MixpanelEvent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MixpanelInsight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MixpanelUserProfile";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotionDatabase";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotionPage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NotionReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestAnalytics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestBoard";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestPin";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestRecommendation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestScheduledPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PinterestTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RunwayVideo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RunwayVideoPrompt";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RunwayVideoStyle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEMrushBacklink";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEMrushDomain";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEMrushInsight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEMrushKeyword";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEMrushMonitoring";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SEMrushReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ScheduledPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialBladeChannel";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialBladeComparison";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialBladeInsight";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialBladeMonitoring";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialBladeReport";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SocialBladeStats";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StableDiffusionImage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StableDiffusionPrompt";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "StableDiffusionStyle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokAnalytics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokRecommendation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokScheduledPost";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokScrapedTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TikTokVideo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitterAnalytics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitterConnection";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitterRecommendation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitterScheduledTweet";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitterTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwitterTweet";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubeAnalytics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubeComment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubePlaylist";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubeRecommendation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubeScheduledVideo";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubeTrend";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "YouTubeVideo";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Analytics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalShares" INTEGER NOT NULL DEFAULT 0,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "avgEngagement" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "language" TEXT NOT NULL DEFAULT 'fr',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Paris',
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SocialIntegration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "platform" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SocialIntegration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatreonConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "patreonId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "tier" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PatreonConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwitchConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "twitchId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "isAffiliate" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TwitchConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiscordConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "serverCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DiscordConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SpotifyConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "isArtist" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SpotifyConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreativeProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "startDate" DATETIME,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "tags" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CreativeProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "assignedTo" INTEGER,
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "CreativeProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectTask_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectAsset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "CreativeProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collaboration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" TEXT,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Collaboration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "CreativeProject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Collaboration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "platform" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "duration" INTEGER,
    "status" TEXT NOT NULL,
    "streamKey" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "maxViewers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LiveMetrics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "liveEventId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "viewerCount" INTEGER NOT NULL,
    "chatMessages" INTEGER NOT NULL DEFAULT 0,
    "donations" INTEGER NOT NULL DEFAULT 0,
    "subscriptions" INTEGER NOT NULL DEFAULT 0,
    "bits" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LiveMetrics_liveEventId_fkey" FOREIGN KEY ("liveEventId") REFERENCES "LiveEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RevenueSource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "date" DATETIME NOT NULL,
    "platform" TEXT,
    "description" TEXT,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RevenueSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinancialGoal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "targetAmount" INTEGER NOT NULL,
    "currentAmount" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "deadline" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PerformanceReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalShares" INTEGER NOT NULL DEFAULT 0,
    "totalPosts" INTEGER NOT NULL DEFAULT 0,
    "avgEngagement" REAL NOT NULL DEFAULT 0.0,
    "totalRevenue" INTEGER NOT NULL DEFAULT 0,
    "growthRate" REAL NOT NULL DEFAULT 0.0,
    "insights" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PerformanceReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "actionRequired" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AIContentTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "length" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AIGenerationHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "generatedContent" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AIGenerationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentSchedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "scheduledAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentSchedule_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL,
    "budget" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TargetAudience" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ageRange" TEXT,
    "interests" TEXT,
    "location" TEXT,
    "platform" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TargetAudience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hashtag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL,
    "category" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HashtagPerformance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "hashtagId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "engagement" REAL NOT NULL DEFAULT 0.0,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HashtagPerformance_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "HashtagPerformance_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Insight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Insight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_InstagramConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "instagramUsername" TEXT NOT NULL,
    "pageId" TEXT,
    "pageName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstagramConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_InstagramConnection" ("accessToken", "createdAt", "expiresAt", "id", "instagramUserId", "instagramUsername", "isActive", "pageId", "pageName", "updatedAt", "userId") SELECT "accessToken", "createdAt", "expiresAt", "id", "instagramUserId", "instagramUsername", "isActive", "pageId", "pageName", "updatedAt", "userId" FROM "InstagramConnection";
DROP TABLE "InstagramConnection";
ALTER TABLE "new_InstagramConnection" RENAME TO "InstagramConnection";
CREATE UNIQUE INDEX "InstagramConnection_userId_instagramUserId_key" ON "InstagramConnection"("userId", "instagramUserId");
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "currency", "id", "status", "userId") SELECT "amount", "createdAt", "currency", "id", "status", "userId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "scheduledAt" DATETIME,
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "engagement" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("createdAt", "engagement", "id", "platform", "scheduledAt", "status", "title", "userId") SELECT "createdAt", coalesce("engagement", 0.0) AS "engagement", "id", "platform", "scheduledAt", "status", "title", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_YouTubeConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" DATETIME,
    "subscriberCount" INTEGER NOT NULL DEFAULT 0,
    "isMonetized" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YouTubeConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_YouTubeConnection" ("accessToken", "channelId", "createdAt", "expiresAt", "id", "isActive", "refreshToken", "subscriberCount", "updatedAt", "userId") SELECT "accessToken", "channelId", "createdAt", "expiresAt", "id", "isActive", "refreshToken", coalesce("subscriberCount", 0) AS "subscriberCount", "updatedAt", "userId" FROM "YouTubeConnection";
DROP TABLE "YouTubeConnection";
ALTER TABLE "new_YouTubeConnection" RENAME TO "YouTubeConnection";
CREATE UNIQUE INDEX "YouTubeConnection_userId_channelId_key" ON "YouTubeConnection"("userId", "channelId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_date_key" ON "Analytics"("date");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialIntegration_userId_platform_key" ON "SocialIntegration"("userId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "PatreonConnection_userId_patreonId_key" ON "PatreonConnection"("userId", "patreonId");

-- CreateIndex
CREATE UNIQUE INDEX "TwitchConnection_userId_twitchId_key" ON "TwitchConnection"("userId", "twitchId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordConnection_userId_discordId_key" ON "DiscordConnection"("userId", "discordId");

-- CreateIndex
CREATE UNIQUE INDEX "SpotifyConnection_userId_spotifyId_key" ON "SpotifyConnection"("userId", "spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaboration_projectId_userId_key" ON "Collaboration"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_tag_key" ON "Hashtag"("tag");
