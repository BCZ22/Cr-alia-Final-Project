/**
 * Health Checks
 * Monitor system health
 */

import { prisma } from '@/lib/db/client'

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded'
  checks: {
    database: boolean
    timestamp: string
  }
  uptime: number
  memory: {
    used: number
    total: number
    percentage: number
  }
}

/**
 * Check database connection
 */
async function checkDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

/**
 * Get memory usage
 */
function getMemoryUsage() {
  if (typeof process !== 'undefined') {
    const mem = process.memoryUsage()
    return {
      used: Math.round(mem.heapUsed / 1024 / 1024), // MB
      total: Math.round(mem.heapTotal / 1024 / 1024), // MB
      percentage: Math.round((mem.heapUsed / mem.heapTotal) * 100),
    }
  }
  return { used: 0, total: 0, percentage: 0 }
}

/**
 * Perform health check
 */
export async function performHealthCheck(): Promise<HealthCheck> {
  const startTime = Date.now()
  const dbHealthy = await checkDatabase()
  const checkDuration = Date.now() - startTime

  const uptime = typeof process !== 'undefined' ? process.uptime() : 0
  const memory = getMemoryUsage()

  // Determine overall status
  let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy'

  if (!dbHealthy) {
    status = 'unhealthy'
  } else if (memory.percentage > 90 || checkDuration > 1000) {
    status = 'degraded'
  }

  return {
    status,
    checks: {
      database: dbHealthy,
      timestamp: new Date().toISOString(),
    },
    uptime: Math.round(uptime),
    memory,
  }
}

