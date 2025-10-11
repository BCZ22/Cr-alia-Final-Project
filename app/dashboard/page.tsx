'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { CrealiaStudioInterface } from '@/components/crealia-studio-interface';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export const dynamic = "force-dynamic";

function DashboardContent() {
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Paiement réussi ! Vos crédits ont été ajoutés.');
    } else if (paymentStatus === 'cancelled') {
      toast.error('Paiement annulé.');
    }
  }, [searchParams]);

  const UserProfile = () => {
    if (status === "loading") {
      return <div>Chargement...</div>;
    }
    if (session) {
      return (
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <Image 
              src={session.user.image} 
              alt={session.user.name || 'Avatar'}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <span>{session.user?.name}</span>
          <Button onClick={() => signOut()} variant="outline">Déconnexion</Button>
        </div>
      );
    }
    return <Button onClick={() => signIn()}>Connexion</Button>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-8">
      <div className="absolute top-8 right-8">
        <UserProfile />
      </div>
      <h1 className="text-5xl font-bold mb-4">Bienvenue sur Créalia</h1>
      <p className="text-xl text-neutral-400 mb-8">Votre studio de création de contenu IA</p>
      <Button 
        onClick={() => setIsStudioOpen(true)}
        disabled={status !== "authenticated"}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Ouvrir Créalia Studio
      </Button>
      {isStudioOpen && <CrealiaStudioInterface onClose={() => setIsStudioOpen(false)} />}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
