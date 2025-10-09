import { NextRequest, NextResponse } from 'next/server';
import FAQService from '../../../../../backend/services/faq.service';

const faqService = new FAQService();

/**
 * GET /api/faq
 * Fetches all active FAQs.
 */
export async function GET(req: NextRequest) {
  try {
    // In a real application, you might add caching here
    const faqs = await faqService.getFAQs();
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch FAQs', details: errorMessage }, { status: 500 });
  }
}

