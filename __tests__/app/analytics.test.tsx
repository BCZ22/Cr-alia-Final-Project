import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (loader: any, options: any) => {
    const DynamicComponent = React.lazy(loader)
    
    return function MockedDynamic(props: any) {
      return (
        <React.Suspense fallback={options?.loading?.() || <div>Loading...</div>}>
          <DynamicComponent {...props} />
        </React.Suspense>
      )
    }
  }
}))

// Mock the CrealiaAnalyticsInterface component
jest.mock('@/components/crealia-analytics-interface', () => ({
  CrealiaAnalyticsInterface: ({ isOpen, onClose }: any) => (
    <div data-testid="analytics-interface">
      <div>Créalia Analytics Pro</div>
      <button onClick={onClose}>Close</button>
      {isOpen && <div>Interface is open</div>}
    </div>
  )
}))

// Mock the ErrorBoundary
jest.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: any) => <div data-testid="error-boundary">{children}</div>
}))

describe('Analytics Page', () => {
  it('should render loading state initially', async () => {
    const AnalyticsPage = (await import('@/app/analytics/page')).default
    
    render(<AnalyticsPage />)
    
    // Should show loading text
    expect(screen.getByText(/chargement de créalia analytics/i)).toBeInTheDocument()
  })

  it('should render analytics interface after loading', async () => {
    const AnalyticsPage = (await import('@/app/analytics/page')).default
    
    render(<AnalyticsPage />)
    
    // Wait for the interface to load
    await waitFor(() => {
      expect(screen.getByTestId('analytics-interface')).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(screen.getByText('Créalia Analytics Pro')).toBeInTheDocument()
  })

  it('should pass isOpen=true to the interface', async () => {
    const AnalyticsPage = (await import('@/app/analytics/page')).default
    
    render(<AnalyticsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Interface is open')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should be wrapped in ErrorBoundary', async () => {
    const AnalyticsPage = (await import('@/app/analytics/page')).default
    
    render(<AnalyticsPage />)
    
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
  })
})
