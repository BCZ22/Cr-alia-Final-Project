import { NextRequest, NextResponse } from 'next/server';
import StudioService from '../../../../../../backend/services/studio.service';
import { z } from 'zod';

const studioService = new StudioService();
// Mock user ID - in a real app, this would come from the session
const MOCK_USER_ID = 'mock-user-id';

const updateProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name cannot be empty." }).optional(),
  description: z.string().optional(),
});

/**
 * GET /api/studio/projects/[id]
 * Fetches a single project by its ID.
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const project = await studioService.getProjectById(id, MOCK_USER_ID);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error fetching project ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch project', details: errorMessage }, { status: 500 });
  }
}

/**
 * PUT /api/studio/projects/[id]
 * Updates a project.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const validation = updateProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error.formErrors }, { status: 400 });
    }

    const updatedProject = await studioService.updateProject(id, validation.data, MOCK_USER_ID);

    if (!updatedProject) {
      return NextResponse.json({ error: 'Project not found or you do not have permission to update it' }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error(`Error updating project ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update project', details: errorMessage }, { status: 500 });
  }
}

/**
 * DELETE /api/studio/projects/[id]
 * Deletes a project.
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const deletedProject = await studioService.deleteProject(id, MOCK_USER_ID);

    if (!deletedProject) {
      return NextResponse.json({ error: 'Project not found or you do not have permission to delete it' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting project ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to delete project', details: errorMessage }, { status: 500 });
  }
}

