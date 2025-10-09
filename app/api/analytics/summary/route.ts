import { NextRequest, NextResponse } from 'next/server';
import AnalyticsService from '../../../../../backend/services/analytics.service';
import { z } from 'zod';

const analyticsService = new AnalyticsService();

// Optional query schema for pagination on the events endpoint
const eventsQuerySchema = z.object({
  page: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number().int().positive().optional()),
  limit: z.preprocess((val) => parseInt(z.string().parse(val), 10), z.number().int().positive().optional()),
});

/**
 * GET /api/analytics/summary
 * Fetches a summary of key platform metrics.
 */
export async function GET(req: NextRequest) {
  try {
    const summary = await analyticsService.getSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch analytics summary', details: errorMessage }, { status: 500 });
  }
}

