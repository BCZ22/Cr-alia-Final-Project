export interface AnalyticsOverview {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalFollowers: number
  engagementRate: number
  reach: number
  impressions: number
  period: {
    start: string
    end: string
  }
}

export interface AnalyticsEvent {
  id: string
  type: 'view' | 'like' | 'comment' | 'share' | 'follow' | 'unfollow'
  platform: string
  contentId?: string
  userId?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface AnalyticsChartData {
  date: string
  views: number
  likes: number
  comments: number
  shares: number
  followers: number
}

export interface AnalyticsPlatformData {
  platform: string
  views: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
  followers: number
  growth: number
}

export interface AnalyticsContentPerformance {
  contentId: string
  title: string
  platform: string
  views: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
  publishedAt: string
  thumbnailUrl?: string
}

export interface AnalyticsAudience {
  ageGroups: Array<{
    range: string
    percentage: number
  }>
  genders: Array<{
    gender: string
    percentage: number
  }>
  locations: Array<{
    country: string
    percentage: number
  }>
  interests: Array<{
    interest: string
    percentage: number
  }>
}

export interface AnalyticsTrends {
  trendingHashtags: Array<{
    hashtag: string
    posts: number
    engagement: number
  }>
  bestPostingTimes: Array<{
    hour: number
    engagement: number
  }>
  contentTypes: Array<{
    type: string
    performance: number
  }>
}

export interface AnalyticsFilters {
  platform?: string
  startDate?: string
  endDate?: string
  contentType?: string
}

export interface AnalyticsResponse<T> {
  data: T
  period: {
    start: string
    end: string
  }
  lastUpdated: string
}
