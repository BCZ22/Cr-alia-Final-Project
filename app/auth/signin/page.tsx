'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950">
      <div className="p-8 bg-neutral-900 rounded-lg shadow-lg text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Connexion à Créalia</h1>
        <p className="text-muted-foreground mb-8">Choisissez une méthode pour vous connecter.</p>
        <div className="space-y-4">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Se connecter avec Google
          </Button>
          {/* Add more providers or a credentials form here */}
        </div>
      </div>
    </div>
  );
}

