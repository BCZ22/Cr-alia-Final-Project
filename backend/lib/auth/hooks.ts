'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context'

export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}

export function useRequireRole(role: string, redirectTo = '/unauthorized') {
  const { hasRole, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole(role)) {
      router.push(redirectTo)
    }
  }, [hasRole, isAuthenticated, isLoading, router, redirectTo, role])

  return { hasRole: hasRole(role), isAuthenticated, isLoading }
}

export function useRequireAdmin(redirectTo = '/unauthorized') {
  return useRequireRole('admin', redirectTo)
}

export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  return { isAuthenticated, isLoading }
}
