import { NextRequest, NextResponse } from 'next/server';
import AnalyticsService from '../../../../../backend/services/analytics.service';
import { z } from 'zod';

const analyticsService = new AnalyticsService();

const eventsQuerySchema = z.object({
  page: z.preprocess((val) => parseInt(z.string().parse(val as string, '10'), 10), z.number().int().positive().default(1)),
  limit: z.preprocess((val) => parseInt(z.string().parse(val as string, '10'), 10), z.number().int().positive().max(100).default(20)),
});

/**
 * GET /api/analytics/events
 * Fetches a paginated list of analytics events.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const validation = eventsQuerySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: validation.error.formErrors }, { status: 400 });
    }

    const { page, limit } = validation.data;

    const events = await analyticsService.getEvents(page, limit);
    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        // In a real app, you'd also return totalPages and totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching analytics events:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch analytics events', details: errorMessage }, { status: 500 });
  }
}

