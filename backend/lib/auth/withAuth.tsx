'use client'

import React, { ComponentType } from 'react'
import { useRequireAuth } from './hooks'

interface WithAuthOptions {
  redirectTo?: string
  loadingComponent?: React.ComponentType
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = '/login', loadingComponent: LoadingComponent } = options

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useRequireAuth(redirectTo)

    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <div>Chargement...</div>
    }

    if (!isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
