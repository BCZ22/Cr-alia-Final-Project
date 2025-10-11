import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserService from "@/backend/services/user.service";

const textToImageSchema = z.object({
  prompt: z.string().min(1, { message: "Prompt is required." }),
  style: z.enum(['réaliste', 'artistique', '3D']).default('réaliste'),
  aspect_ratio: z.enum(['1:1', '16:9', '9:16']).default('1:1'),
});

const useMock = process.env.USE_MOCK === 'true';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const userService = new UserService();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  
  try {
    const hasCredits = await userService.hasEnoughCredits(userId);
    if (!hasCredits) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 }); // 402 Payment Required
    }

    const body = await req.json();
    const validation = textToImageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.formErrors }, { status: 400 });
    }

    const { prompt, style, aspect_ratio } = validation.data;

    if (useMock) {
      const mockImageUrl = `/mock/mock-image-1.jpg`;
      return NextResponse.json({ imageUrl: mockImageUrl });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not configured.' }, { status: 500 });
    }

    // --- Real OpenAI Service Logic ---
    const imageResponse = await openai.images.generate({
      model: "dall-e-3", // or "dall-e-2"
      prompt: `Style: ${style}. ${prompt}`,
      n: 1,
      size: aspect_ratio === '1:1' ? '1024x1024' : (aspect_ratio === '16:9' ? '1792x1024' : '1024x1792'),
    });

    const imageUrl = imageResponse.data[0].url;
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Failed to generate image from OpenAI' }, { status: 500 });
    }

    await userService.deductCreditsAndLog(userId, { prompt, imageUrl });

    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error('Error in text-to-image endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to generate image', details: errorMessage }, { status: 500 });
  }
}
