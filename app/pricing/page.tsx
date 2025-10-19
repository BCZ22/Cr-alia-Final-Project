'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Metadata } from 'next'
import canonicalData from '@/data/canonical-site-data.json'

export default function PricingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)
  
  // Utiliser les données canoniques
  const plans = canonicalData.pricing.plans[billingCycle]

  // Handle subscription click
  const handleSubscribe = async (planId: string) => {
    // Check if user is authenticated
    if (!session?.user) {
      // Redirect to sign in
      router.push('/auth/signin?callbackUrl=/pricing')
      return
    }

    setLoading(planId)

    try {
      // Call checkout API
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingCycle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      window.location.href = data.url
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Erreur lors de la création de la session de paiement. Veuillez réessayer.')
      setLoading(null)
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-8">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-sm font-medium text-primary">Tarifs</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
          Des plans pour <br />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            tous les créateurs
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
          Créez du contenu viral sans limites. Annulez à tout moment.
        </p>

        {/* Toggle Monthly/Yearly */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              billingCycle === 'yearly'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Annuel
            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Économisez 30%
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`glass-card p-8 rounded-3xl ${
                plan.highlighted ? 'border-2 border-primary shadow-2xl scale-105' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="inline-block px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold mb-4">
                  Plus populaire
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              {billingCycle === 'yearly' && 'billedYearly' in plan && (
                <p className="text-sm text-muted-foreground mb-4">
                  Facturé ${plan.billedYearly}/an
                </p>
              )}
              <p className="text-sm text-muted-foreground mb-6">
                {plan.videosPerMonth} vidéos/mois
              </p>
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.highlighted
                    ? 'btn-gradient text-white'
                    : 'border-2 border-border hover:border-primary/40'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
              >
                {loading === plan.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  plan.cta
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="pt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Toutes les offres incluent une garantie satisfait ou remboursé de 30 jours
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Aucune carte requise pour l'essai</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Annulez à tout moment</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
