import { NextRequest, NextResponse } from 'next/server';
import AIService from "@/backend/services/ai/ai.service";
import { z } from 'zod';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const aiService = new AIService();

const generateSchema = z.object({
  prompt: z.string().min(1, { message: "Le prompt est requis." }),
  // Les options supplémentaires sont maintenant facultatives
  options: z.object({
    model: z.string().optional(),
    maxTokens: z.number().optional(),
    temperature: z.number().optional(),
  }).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: 'Corps de la requête invalide', details: validation.error.formErrors }, { status: 400 });
    }

    const { prompt } = validation.data;
    
    // Pour la démo, nous allons utiliser une version simplifiée du service AI.
    // L'implémentation complète utiliserait les options supplémentaires.
    const content = await aiService.generateContent({
      prompt: prompt,
      type: 'caption',
      length: 'medium',
      tone: 'casual',
    });

    // TODO: Enregistrer la requête dans l'historique de l'utilisateur avec Prisma.

    return NextResponse.json({ ok: true, result: content, meta: { model: 'mock-model-v1' } });
  } catch (error) {
    console.error('Erreur dans la génération de contenu IA:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
    return NextResponse.json({ error: 'Échec de la génération de contenu', details: errorMessage }, { status: 500 });
  }
}

