import { NextRequest, NextResponse } from 'next/server';
import StudioService from '@/backend/services/studio.service';
import { z } from 'zod';

const studioService = new StudioService();
// Mock user ID - in a real app, this would come from the session
const MOCK_USER_ID = 'mock-user-id';

const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required." }),
  description: z.string().optional(),
});

/**
 * GET /api/studio/projects
 * Fetches all projects for the user.
 */
export async function GET(req: NextRequest) {
  try {
    const projects = await studioService.getProjects(MOCK_USER_ID);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch projects', details: errorMessage }, { status: 500 });
  }
}

/**
 * POST /api/studio/projects
 * Creates a new project.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.formErrors }, { status: 400 });
    }

    const { name, description } = validation.data;

    const newProject = await studioService.createProject({
      name,
      description,
      userId: MOCK_USER_ID,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to create project', details: errorMessage }, { status: 500 });
  }
}

