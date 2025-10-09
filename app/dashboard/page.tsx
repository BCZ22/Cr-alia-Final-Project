'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CrealiaStudioInterface } from '@/components/crealia-studio-interface';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Créalia Dashboard</h1>
        <UserProfile />
      </header>
      
      <main className="flex flex-col items-center justify-center text-center">
        <h2 className="text-4xl font-bold mb-4">Bienvenue sur votre Dashboard</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Lancez le Studio pour commencer à créer.
        </p>
        <Button 
          onClick={() => setIsStudioOpen(true)}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-bold py-3 px-6 rounded-lg"
          disabled={!session}
        >
          Ouvrir Créalia Studio
        </Button>
        {!session && <p className="text-sm mt-4 text-amber-500">Veuillez vous connecter pour accéder au Studio.</p>}
      </main>

      {session && (
        <CrealiaStudioInterface 
          isOpen={isStudioOpen} 
          onClose={() => setIsStudioOpen(false)} 
        />
      )}
    </div>
  );
}
