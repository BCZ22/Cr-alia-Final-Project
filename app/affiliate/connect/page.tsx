"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AffiliateConnectPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/connect-onboard", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Impossible de lancer l'onboarding");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 text-center p-6">
        <div className="max-w-lg space-y-6">
          <h1 className="text-3xl font-semibold text-foreground mb-4">
            Connexion Stripe
          </h1>
          <p className="text-muted-foreground mb-8">
            Connectez-vous pour lier votre compte Stripe et recevoir des paiements
            d&apos;affiliation automatiquement.
          </p>
          <Link href="/auth/signin">
            <Button className="px-6 py-3">Se connecter</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 text-center p-6">
      <div className="max-w-lg space-y-6">
        <div className="text-5xl mb-4">💳</div>
        <h1 className="text-3xl font-semibold text-foreground mb-4">
          Connecter mon compte Stripe
        </h1>
        <p className="text-muted-foreground mb-8">
          Créez un compte Stripe Express pour recevoir vos paiements
          d&apos;affiliation automatiquement chaque mois.
        </p>
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="px-8 py-4 text-lg rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all"
        >
          {loading ? "Redirection vers Stripe..." : "Démarrer l'onboarding Stripe"}
        </Button>
        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}
      </div>
    </main>
  );
}

