/**
 * Global Error Handler (Root)
 * Fallback for errors in root layout
 */

'use client'

import { useEffect } from 'react'
import { captureException } from '@/lib/monitoring/sentry'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
    captureException(error, { digest: error.digest })
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
        }}>
          <div style={{
            maxWidth: '500px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>
              Erreur Application
            </h1>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Une erreur critique s'est produite. Veuillez recharger la page.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Recharger
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}

