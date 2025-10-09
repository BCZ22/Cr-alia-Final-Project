import { NextRequest, NextResponse } from 'next/server';
import AIService from '../../../../../backend/services/ai/ai.service';
import { z } from 'zod';

const aiService = new AIService();

const generateSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required." }),
  type: z.enum(['script', 'description', 'hashtags', 'caption']).default('caption'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  tone: z.enum(['professional', 'casual', 'creative']).default('casual'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.formErrors }, { status: 400 });
    }

    const { prompt, type, length, tone } = validation.data;

    // Here we would normally save the request to the database
    // using Prisma, tied to the authenticated user.
    // For now, we call the mocked service directly.

    const content = await aiService.generateContent({
      prompt,
      type,
      length,
      tone,
    });

    return NextResponse.json({ ok: true, result: content });
  } catch (error) {
    console.error('Error in AI content generation:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate content', details: errorMessage }, { status: 500 });
  }
}

