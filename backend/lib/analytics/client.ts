import { apiClient } from '../api/client'
import type { 
  AnalyticsOverview,
  AnalyticsEvent,
  AnalyticsChartData,
  AnalyticsPlatformData,
  AnalyticsContentPerformance,
  AnalyticsAudience,
  AnalyticsTrends,
  AnalyticsFilters,
  AnalyticsResponse
} from './types'

export class AnalyticsClient {
  // Get analytics overview
  static async getOverview(filters: AnalyticsFilters = {}): Promise<AnalyticsResponse<AnalyticsOverview>> {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    )

    const response = await apiClient.get<AnalyticsResponse<AnalyticsOverview>>(
      `/analytics/overview?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des analytics')
    }

    return response.data
  }

  // Get analytics events
  static async getEvents(
    filters: AnalyticsFilters = {},
    page = 1,
    limit = 50
  ): Promise<AnalyticsResponse<{ events: AnalyticsEvent[]; total: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    })

    const response = await apiClient.get<AnalyticsResponse<{ events: AnalyticsEvent[]; total: number }>>(
      `/analytics/events?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des événements')
    }

    return response.data
  }

  // Get chart data for time series
  static async getChartData(
    filters: AnalyticsFilters = {},
    granularity: 'day' | 'week' | 'month' = 'day'
  ): Promise<AnalyticsResponse<AnalyticsChartData[]>> {
    const params = new URLSearchParams({
      granularity,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    })

    const response = await apiClient.get<AnalyticsResponse<AnalyticsChartData[]>>(
      `/analytics/chart?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des données de graphique')
    }

    return response.data
  }

  // Get platform data
  static async getPlatformData(filters: AnalyticsFilters = {}): Promise<AnalyticsResponse<AnalyticsPlatformData[]>> {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    )

    const response = await apiClient.get<AnalyticsResponse<AnalyticsPlatformData[]>>(
      `/analytics/platforms?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des données de plateforme')
    }

    return response.data
  }

  // Get content performance
  static async getContentPerformance(
    filters: AnalyticsFilters = {},
    page = 1,
    limit = 20
  ): Promise<AnalyticsResponse<{ content: AnalyticsContentPerformance[]; total: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    })

    const response = await apiClient.get<AnalyticsResponse<{ content: AnalyticsContentPerformance[]; total: number }>>(
      `/analytics/content?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des performances de contenu')
    }

    return response.data
  }

  // Get audience insights
  static async getAudience(filters: AnalyticsFilters = {}): Promise<AnalyticsResponse<AnalyticsAudience>> {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    )

    const response = await apiClient.get<AnalyticsResponse<AnalyticsAudience>>(
      `/analytics/audience?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des insights d\'audience')
    }

    return response.data
  }

  // Get trends
  static async getTrends(filters: AnalyticsFilters = {}): Promise<AnalyticsResponse<AnalyticsTrends>> {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      )
    )

    const response = await apiClient.get<AnalyticsResponse<AnalyticsTrends>>(
      `/analytics/trends?${params}`
    )
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des tendances')
    }

    return response.data
  }

  // Export analytics data
  static async exportData(
    format: 'csv' | 'xlsx' | 'json' = 'csv',
    filters: AnalyticsFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined)
      ),
    })

    const response = await fetch(`/api/analytics/export?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export des données')
    }

    return response.blob()
  }

  // Get real-time analytics
  static async getRealtimeMetrics(): Promise<AnalyticsResponse<{
    activeUsers: number
    currentViews: number
    recentActivity: AnalyticsEvent[]
  }>> {
    const response = await apiClient.get<AnalyticsResponse<{
      activeUsers: number
      currentViews: number
      recentActivity: AnalyticsEvent[]
    }>>('/analytics/realtime')
    
    if (!response.ok || !response.data) {
      throw new Error(response.error || 'Erreur lors de la récupération des métriques en temps réel')
    }

    return response.data
  }
}

export default AnalyticsClient
