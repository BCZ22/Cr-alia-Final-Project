import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { applyRateLimiter } from '@/lib/rate-limiter';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token manquant.'),
  password: z.string().min(10, 'Le mot de passe doit contenir au moins 10 caractères.'),
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const limit = 5; // 5 requests
  const windowMs = 60 * 1000; // 1 minute

  const isAllowed = applyRateLimiter(ip, limit, windowMs);

  if (!isAllowed) {
    return NextResponse.json({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { token, password } = validation.data;

    // Hash the token to find it in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Token invalide ou expiré.' }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user's password and clear the reset token fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('[API] Reset Password Error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
