/**
 * Cookie Consent Banner
 * GDPR-compliant cookie consent
 */

'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CookieConsentBanner() {
  const [show, setShow] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now(),
    }))
    setShow(false)
  }

  const acceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: Date.now(),
    }))
    setShow(false)
  }

  const savePreferences = (prefs: any) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...prefs,
      necessary: true, // Always true
      timestamp: Date.now(),
    }))
    setShow(false)
    setShowPreferences(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur-lg border-t border-border">
      <div className="max-w-6xl mx-auto">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold mb-2">🍪 Nous utilisons des cookies</h3>
              <p className="text-sm text-muted-foreground">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
                En cliquant sur "Accepter tout", vous acceptez notre utilisation des cookies.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
              >
                Personnaliser
              </Button>
              <Button
                variant="outline"
                onClick={acceptNecessary}
              >
                Nécessaires uniquement
              </Button>
              <Button
                className="btn-gradient"
                onClick={acceptAll}
              >
                Accepter tout
              </Button>
            </div>
          </div>
        ) : (
          <CookiePreferences
            onSave={savePreferences}
            onCancel={() => setShowPreferences(false)}
          />
        )}
      </div>
    </div>
  )
}

function CookiePreferences({
  onSave,
  onCancel,
}: {
  onSave: (prefs: any) => void
  onCancel: () => void
}) {
  const [prefs, setPrefs] = useState({
    analytics: false,
    marketing: false,
    preferences: false,
  })

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg">Préférences de cookies</h3>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Cookies nécessaires</p>
            <p className="text-sm text-muted-foreground">
              Requis pour le fonctionnement du site
            </p>
          </div>
          <div className="text-sm text-muted-foreground">Toujours actifs</div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Cookies analytiques</p>
            <p className="text-sm text-muted-foreground">
              Nous aident à améliorer notre site
            </p>
          </div>
          <input
            type="checkbox"
            checked={prefs.analytics}
            onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
            className="mt-1"
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Cookies marketing</p>
            <p className="text-sm text-muted-foreground">
              Pour vous montrer des publicités pertinentes
            </p>
          </div>
          <input
            type="checkbox"
            checked={prefs.marketing}
            onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
            className="mt-1"
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">Cookies de préférences</p>
            <p className="text-sm text-muted-foreground">
              Mémorisent vos choix et préférences
            </p>
          </div>
          <input
            type="checkbox"
            checked={prefs.preferences}
            onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button className="btn-gradient" onClick={() => onSave(prefs)}>
          Enregistrer
        </Button>
      </div>
    </div>
  )
}

