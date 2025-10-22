import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AffiliateOnboardedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 text-center p-6">
      <div className="max-w-lg space-y-6">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-semibold text-green-600 mb-4">
          Onboarding réussi !
        </h1>
        <p className="text-muted-foreground mb-8">
          Votre compte Stripe Express est maintenant connecté.
          <br />
          Vous pourrez recevoir automatiquement vos gains d&apos;affiliation.
        </p>
        <Link href="/affiliate/dashboard">
          <Button className="px-8 py-4 text-lg rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all">
            Accéder à mon tableau de bord
          </Button>
        </Link>
      </div>
    </main>
  );
}

