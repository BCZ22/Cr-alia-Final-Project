/**
 * Application Metrics
 * Track performance and usage metrics
 */

import { logger } from './logger'

export interface Metric {
  name: string
  value: number
  timestamp: string
  tags?: Record<string, string>
}

class MetricsCollector {
  private metrics: Metric[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor() {
    // Flush metrics every 60 seconds
    if (typeof window === 'undefined') {
      this.startFlushInterval()
    }
  }

  /**
   * Start periodic flush
   */
  private startFlushInterval() {
    this.flushInterval = setInterval(() => {
      this.flush()
    }, 60000) // 60 seconds
  }

  /**
   * Record a metric
   */
  record(name: string, value: number, tags?: Record<string, string>) {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      tags,
    }

    this.metrics.push(metric)

    // Flush if we have too many metrics
    if (this.metrics.length >= 100) {
      this.flush()
    }
  }

  /**
   * Increment counter
   */
  increment(name: string, tags?: Record<string, string>) {
    this.record(name, 1, tags)
  }

  /**
   * Record duration
   */
  recordDuration(name: string, duration: number, tags?: Record<string, string>) {
    this.record(name, duration, { ...tags, unit: 'ms' })
  }

  /**
   * Flush metrics
   */
  private flush() {
    if (this.metrics.length === 0) return

    logger.debug('Flushing metrics', { count: this.metrics.length })

    // In production, send to monitoring service (Datadog, CloudWatch, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service
      // Example: await fetch('/api/metrics', { method: 'POST', body: JSON.stringify(this.metrics) })
    }

    // Clear metrics
    this.metrics = []
  }

  /**
   * Cleanup
   */
  cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

// Export singleton
export const metrics = new MetricsCollector()

/**
 * Measure execution time
 */
export async function measureTime<T>(
  name: string,
  fn: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  const start = Date.now()
  try {
    const result = await fn()
    const duration = Date.now() - start
    metrics.recordDuration(name, duration, tags)
    return result
  } catch (error) {
    const duration = Date.now() - start
    metrics.recordDuration(name, duration, { ...tags, status: 'error' })
    throw error
  }
}

export default metrics

