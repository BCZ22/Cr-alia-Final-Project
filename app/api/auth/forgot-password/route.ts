import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { addHours } from 'date-fns';
import { applyRateLimiter } from '@/lib/rate-limiter';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse e-mail invalide.'),
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
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return a generic success message to prevent user enumeration
      return NextResponse.json({ message: 'Si un compte avec cet e-mail existe, un lien de réinitialisation a été envoyé.' });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiry to 1 hour from now
    const passwordResetTokenExpiry = addHours(new Date(), 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetTokenExpiry,
      },
    });

    // In a real application, you would send an email here with the `resetToken`.
    // For this implementation, we will not send an email.
    // We also won't return the token for security reasons in a real app,
    // but for testing purposes, we could consider it. Let's stick to a secure-by-default approach.

    return NextResponse.json({ message: 'Si un compte avec cet e-mail existe, un lien de réinitialisation a été envoyé.' });
  } catch (error) {
    console.error('[API] Forgot Password Error:', error);
    return NextResponse.json({ error: 'Une erreur interne est survenue.' }, { status: 500 });
  }
}
