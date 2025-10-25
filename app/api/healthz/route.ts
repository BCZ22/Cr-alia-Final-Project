import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function GET() {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'pending',
      stripe: 'pending',
    },
  };

  let isHealthy = true;

  // 1. Check Database Connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.services.database = 'ok';
  } catch (error) {
    console.error('[Health Check] Database connection failed:', error);
    healthStatus.services.database = 'error';
    isHealthy = false;
  }

  // 2. Check Stripe API Connectivity
  try {
    // Make a simple, low-impact request to Stripe to verify the API key
    await stripe.products.list({ limit: 1 });
    healthStatus.services.stripe = 'ok';
  } catch (error) {
    console.error('[Health Check] Stripe API connection failed:', error);
    healthStatus.services.stripe = 'error';
    isHealthy = false;
  }

  if (!isHealthy) {
    healthStatus.status = 'error';
    return NextResponse.json(healthStatus, { status: 503 });
  }

  return NextResponse.json(healthStatus, { status: 200 });
}
