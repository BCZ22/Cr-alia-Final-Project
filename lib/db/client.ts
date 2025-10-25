/**
 * Database Client
 * Prisma Client singleton with connection pooling
 */

import { PrismaClient } from '@prisma/client'

const requiredEnvs = [
  'DATABASE_URL',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'OPENAI_API_KEY',
];

if (process.env.NODE_ENV === 'production') {
  requiredEnvs.forEach(envVar => {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });

  if (!process.env.NEXTAUTH_URL && !process.env.BASE_URL) {
    throw new Error('Missing required environment variable: NEXTAUTH_URL or BASE_URL');
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma

