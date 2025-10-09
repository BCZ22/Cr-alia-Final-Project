import { NextRequest, NextResponse } from 'next/server';
import InspirationService from '../../../../backend/services/inspiration.service';
import { z } from 'zod';

const inspirationService = new InspirationService();
// Mock user ID - in a real app, this would come from the session
const MOCK_USER_ID = 'mock-user-id';

const getTemplatesSchema = z.object({
  category: z.string().optional(),
  tag: z.string().optional(),
});

const submitTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['PHOTO_EDIT', 'VIDEO_EDIT', 'SOCIAL_POST', 'CAROUSEL', 'STORY', 'REEL', 'PRESENTATION', 'BRAND_KIT', 'FILTER_PRESET', 'LUT_PRESET', 'TRANSITION_PRESET']),
  category: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  data: z.any(),
});

/**
 * GET /api/inspiration
 * Fetches inspiration templates with optional filters.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());
    
    const validation = getTemplatesSchema.safeParse(query);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid query parameters', details: validation.error.formErrors }, { status: 400 });
    }

    const templates = await inspirationService.getTemplates(validation.data);
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Failed to get inspiration templates:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to load inspiration data', details: errorMessage }, { status: 500 });
  }
}

/**
 * POST /api/inspiration
 * Handles user submission of a new template.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = submitTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.formErrors }, { status: 400 });
    }

    const newTemplate = await inspirationService.submitTemplate({
      ...validation.data,
      userId: MOCK_USER_ID,
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Failed to submit template:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to submit template', details: errorMessage }, { status: 500 });
  }
}
