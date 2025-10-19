/**
 * Database Module - Public API
 * Exports database client and repositories
 */

export { prisma, default as db } from './client'

export * from './repositories'

