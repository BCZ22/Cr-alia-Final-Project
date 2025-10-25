import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/studio/projects/[id]
export async function GET(req: NextRequest, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(`Erreur lors de la récupération du projet ${params.id}:`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// PUT /api/studio/projects/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, description } = body;

        const project = await prisma.project.findFirst({
            where: { id: params.id, userId: session.user.id }
        });

        if (!project) {
            return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
        }

        const updatedProject = await prisma.project.update({
            where: { id: params.id },
            data: { name, description },
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du projet ${params.id}:`, error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}

// DELETE /api/studio/projects/[id]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    try {
        const project = await prisma.project.findFirst({
            where: { id: params.id, userId: session.user.id }
        });

        if (!project) {
            return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 });
        }

        await prisma.project.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Projet supprimé avec succès' }, { status: 200 });
    } catch (error) {
        console.error(`Erreur lors de la suppression du projet ${params.id}:`, error);
        return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
    }
}

