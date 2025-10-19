/**
 * Global Error Boundary
 * Catch and display runtime errors
 */

'use client'

import { useEffect } from 'react'
import { captureException } from '@/lib/monitoring/sentry'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console
    console.error('Application error:', error)

    // Capture in Sentry
    captureException(error, {
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="glass-card p-8 max-w-lg text-center">
        <div className="text-6xl mb-4">⚠️</div>
        
        <h1 className="text-3xl font-bold mb-4">
          Oups ! Une erreur s'est produite
        </h1>
        
        <p className="text-muted-foreground mb-6">
          Nous sommes désolés, quelque chose s'est mal passé. Notre équipe a été notifiée et travaille sur le problème.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-mono text-destructive mb-2">
              {error.name}: {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className="btn-gradient"
          >
            Réessayer
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Retour à l'accueil
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          Si le problème persiste, contactez-nous via le chat support.
        </p>
      </Card>
    </div>
  )
}

