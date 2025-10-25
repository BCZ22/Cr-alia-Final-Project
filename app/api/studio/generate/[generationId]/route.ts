import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { generationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const { generationId } = params;

  if (!generationId) {
    return NextResponse.json({ error: 'Missing generationId parameter' }, { status: 400 });
  }

  try {
    const generation = await prisma.generation.findUnique({
      where: {
        id: generationId,
      },
    });

    if (!generation) {
      return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
    }

    // Security check: ensure the user requesting the job is the one who created it
    if (generation.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Map Prisma model to the frontend's GenerationJob type
    const jobStatus = {
        id: generation.id,
        job_id: generation.id,
        status: generation.status.toLowerCase(), // Ensure enum compatibility
        progress: generation.progress,
        error: generation.error,
        resultUrl: generation.result, // Assuming result is a URL stored in a JSON object for now
        outputs: generation.result ? [{ id: 'output_1', url: generation.result.url, thumbnail: generation.result.url }] : [],
    };

    return NextResponse.json(jobStatus);
  } catch (error) {
    console.error(`[API] Error fetching generation status for ${generationId}:`, error);
    return NextResponse.json({ error: 'Failed to fetch generation status' }, { status: 500 });
  }
}
