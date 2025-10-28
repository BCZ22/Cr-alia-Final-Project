"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const dynamicConfig = 'force-dynamic'

const CrealiaAnalyticsInterface = dynamic(
  () => import('@/components/crealia-analytics-interface').then(mod => mod.CrealiaAnalyticsInterface),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de Créalia Analytics...</p>
        </div>
      </div>
    )
  }
)

export default function AnalyticsPage() {
  const handleAnalyticsError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Analytics Interface Error:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      // Try to go back, or fallback to home
      if (window.history.length > 1) {
        window.history.back()
      } else {
        window.location.href = '/'
      }
    }
  }

  return (
    <ErrorBoundary 
      onError={handleAnalyticsError}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Initialisation de Créalia Analytics...</p>
          </div>
        </div>
      }>
        <CrealiaAnalyticsInterface 
          isOpen={true} 
          onClose={handleClose}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
