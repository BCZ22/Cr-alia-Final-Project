import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import Replicate from 'replicate';
import fs from 'fs/promises';
import path from 'path';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserService from '../../../../../backend/services/user.service';

const useMock = process.env.USE_MOCK === 'true';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
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
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (useMock) {
      const mockImageUrl = `/mock/mock-enhanced-image.jpg`;
      return NextResponse.json({ enhancedUrl: mockImageUrl });
    }

    if (!process.env.REPLICATE_API_KEY) {
      return NextResponse.json({ error: 'Replicate API key is not configured.' }, { status: 500 });
    }

    // --- Real Replicate Service Logic ---
    // 1. Convert file to a buffer and then to a data URI
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const base64 = fileBuffer.toString('base64');
    const dataURI = `data:${mimeType};base64,${base64}`;

    // 2. Call Replicate API
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c523779c47f01c9da3a3abf2081032cf50891b",
      {
        input: {
          image: dataURI,
        },
      }
    );
    
    const enhancedUrl = Array.isArray(output) ? output[0] : output;

    if (!enhancedUrl) {
      return NextResponse.json({ error: 'Failed to enhance image using Replicate' }, { status: 500 });
    }
    
    await userService.deductCreditsAndLog(userId, { imageUrl: enhancedUrl, prompt: `Enhanced image: ${file.name}` });

    return NextResponse.json({ enhancedUrl });

  } catch (error) {
    console.error('Error in enhance-image endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to enhance image', details: errorMessage }, { status: 500 });
  }
}
