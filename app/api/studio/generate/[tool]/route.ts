import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateRequestBodySchema = z.object({
  projectId: z.string().cuid(),
  params: z.record(z.any()), // This should be refined per tool
});

export async function POST(
  request: Request,
  { params }: { params: { tool: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await request.json();
  const validation = generateRequestBodySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
  }

  const { projectId, params: toolParams } = validation.data;
  const { tool } = params;

  try {
    const newGeneration = await prisma.generation.create({
      data: {
        userId,
        projectId,
        tool,
        parameters: toolParams,
        status: 'PROCESSING', // Start as processing
        progress: 10,
        type: 'TEXT_TO_IMAGE', // Mock
        model: 'dall-e-3', // Mock
        prompt: toolParams.prompt || '',
      },
    });

    // --- Start of mocked background job ---
    setTimeout(async () => {
      try {
        await prisma.generation.update({
          where: { id: newGeneration.id },
          data: { 
            status: 'COMPLETED',
            progress: 100,
            completedAt: new Date(),
            result: { url: `https://picsum.photos/seed/${newGeneration.id}/1024/1024` } as any, // Using picsum.photos for mock image
          },
        });
        console.log(`[Mock Job] Finished processing generation ${newGeneration.id}`);
      } catch (err) {
        await prisma.generation.update({
          where: { id: newGeneration.id },
          data: {
            status: 'FAILED',
            error: 'Mock processing failed.',
          },
        });
        console.error(`[Mock Job] Error processing generation ${newGeneration.id}:`, err);
      }
    }, 10000); // 10-second mock processing time
    // --- End of mocked background job ---

    return NextResponse.json(
      {
        generationId: newGeneration.id,
        status: newGeneration.status,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error(`[API] Error creating generation for tool ${tool}:`, error);
    return NextResponse.json({ error: 'Failed to create generation record' }, { status: 500 });
  }
}
