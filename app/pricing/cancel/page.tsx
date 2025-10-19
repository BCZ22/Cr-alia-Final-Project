/**
 * Pricing Cancel Page
 * Displayed when user cancels Stripe checkout
 */

'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PricingCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="glass-card p-8 max-w-md text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h1 className="text-3xl font-bold mb-4">Paiement annulé</h1>
        <p className="text-muted-foreground mb-8">
          Vous avez annulé le processus de paiement. Aucun montant n'a été débité.
        </p>

        <div className="bg-secondary/20 rounded-lg p-4 mb-8 text-left">
          <h3 className="font-bold mb-3">Pourquoi nous choisir ?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Essai gratuit de 14 jours</li>
            <li>✓ Annulation à tout moment</li>
            <li>✓ Garantie satisfait ou remboursé 30 jours</li>
            <li>✓ Support client 24/7</li>
            <li>✓ Accès immédiat à toutes les fonctionnalités</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            className="btn-gradient"
            onClick={() => router.push('/pricing')}
          >
            Voir les tarifs
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            Retour à l'accueil
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Des questions ? Contactez notre{' '}
          <a href="/support/chat" className="text-primary hover:underline">
            support client
          </a>
        </p>
      </Card>
    </div>
  )
}

