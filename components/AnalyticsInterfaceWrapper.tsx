"use client"

import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { CrealiaAnalyticsInterface } from '@/components/crealia-analytics-interface'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AnalyticsInterfaceWrapperProps {
  isOpen: boolean
  onClose?: () => void
}

export function AnalyticsInterfaceWrapper({ isOpen, onClose }: AnalyticsInterfaceWrapperProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Verify analytics interface dependencies
    const checkDependencies = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Check if required UI components are available
        const requiredModules = [
          '@/components/ui/button',
          '@/components/ui/card',
          '@/components/ui/badge'
        ]

        // Simulate permission/config check
        // In production, this would call an API endpoint
        await new Promise(resolve => setTimeout(resolve, 100))

        // Check localStorage for feature flags (optional)
        const analyticsEnabled = localStorage.getItem('analytics_enabled') !== 'false'
        
        setHasPermission(analyticsEnabled)
      } catch (err) {
        console.error('Analytics dependency check failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkDependencies()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Erreur de chargement</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  // Permission denied state
  if (hasPermission === false) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto" />
          <h2 className="text-xl font-bold">Accès restreint</h2>
          <p className="text-muted-foreground">
            L'interface Analytics n'est pas disponible pour le moment.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  // Render the actual component wrapped in ErrorBoundary
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Analytics Interface Runtime Error:', {
          error: error.message,
          componentStack: errorInfo.componentStack
        })
      }}
      onReset={() => {
        // Reset any local state if needed
        setError(null)
        setHasPermission(null)
        setIsLoading(true)
      }}
    >
      <CrealiaAnalyticsInterface 
        isOpen={isOpen} 
        onClose={onClose || (() => window.history.back())}
      />
    </ErrorBoundary>
  )
}
