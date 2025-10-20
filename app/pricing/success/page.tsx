/**
 * Pricing Success Page
 * Displayed after successful Stripe checkout
 */

'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PaymentInfo {
  payment: {
    id: string
    planName: string
    amount: number
    currency: string
    status: string
    billingCycle: string
  }
  subscription: {
    id: string
    status: string
    currentPeriodEnd: number
  }
}

function PricingSuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      setError('Session ID missing')
      setLoading(false)
      return
    }

    // Fetch payment info
    fetch(`/api/checkout/session-info?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setPaymentInfo(data)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch payment info:', err)
        setError('Failed to load payment information')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
        <Card className="glass-card p-8 max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Erreur</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => router.push('/pricing')}>Retour aux tarifs</Button>
        </Card>
      </div>
    )
  }

  if (!paymentInfo) {
    return null
  }

  const { payment, subscription } = paymentInfo
  const formattedAmount = (payment.amount / 100).toFixed(2)
  const periodEnd = new Date(subscription.currentPeriodEnd * 1000)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="glass-card p-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-2">Paiement réussi !</h1>
          <p className="text-xl text-muted-foreground">
            Bienvenue dans le plan {payment.planName}
          </p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-bold">{payment.planName}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
            <span className="text-muted-foreground">Montant</span>
            <span className="font-bold">
              {formattedAmount} {payment.currency.toUpperCase()}/{' '}
              {payment.billingCycle === 'monthly' ? 'mois' : 'an'}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
            <span className="text-muted-foreground">Statut</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ✓ {payment.status}
            </span>
          </div>

          <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
            <span className="text-muted-foreground">Prochain paiement</span>
            <span className="font-bold">
              {periodEnd.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
          <h3 className="font-bold mb-2">✨ Prochaines étapes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Votre abonnement est maintenant actif</li>
            <li>✓ Vous avez accès à toutes les fonctionnalités premium</li>
            <li>✓ Période d'essai de 14 jours incluse</li>
            <li>✓ Annulation possible à tout moment</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="flex-1 btn-gradient"
            onClick={() => router.push('/dashboard')}
          >
            Accéder au tableau de bord
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push('/account')}
          >
            Gérer mon abonnement
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Un email de confirmation a été envoyé à votre adresse.
        </p>
      </Card>
    </div>
  )
}

export default function PricingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <PricingSuccessPageContent />
    </Suspense>
  )
}

