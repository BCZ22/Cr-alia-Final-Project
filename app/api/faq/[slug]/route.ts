import { NextRequest, NextResponse } from 'next/server';
import FaqService from '@/backend/services/faq.service';

const faqService = new FaqService();

/**
 * GET /api/faq/[slug]
 * Fetches a single FAQ by its slug.
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const faq = await faqService.getFAQBySlug(slug);

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error(`Error fetching FAQ with slug ${params.slug}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch FAQ', details: errorMessage }, { status: 500 });
  }
}

