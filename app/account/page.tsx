'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { loadStripe } from '@stripe/stripe-js';

// Define the structure of the account data
interface AccountData {
  credits: number;
  history: {
    id: string;
    prompt: string | null;
    imageUrl: string | null;
    createdAt: string;
  }[];
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function AccountPage() {
  const { data: session } = useSession();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch('/api/account')
        .then((res) => res.json())
        .then((data) => {
          setAccountData(data);
          setIsLoading(false);
        });
    }
  }, [session]);

  const handlePurchase = async (priceId: string) => {
    const res = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    const { sessionId } = await res.json();
    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };

  if (isLoading) {
    return <div className="text-center p-10">Chargement des données du compte...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Mon Compte</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Mes Crédits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{accountData?.credits ?? 0}</p>
              <p className="text-muted-foreground">crédits restants</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Acheter des Crédits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => handlePurchase(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_10_CREDITS || '')} className="w-full">
                Acheter 10 Crédits
              </Button>
               <Button onClick={() => handlePurchase(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_50_CREDITS || '')} className="w-full">
                Acheter 50 Crédits
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mon Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {accountData?.history.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.prompt || ''} className="w-16 h-16 rounded-md object-cover" />
                    )}
                    <div>
                      <p className="font-semibold">{item.prompt || 'Image améliorée'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

