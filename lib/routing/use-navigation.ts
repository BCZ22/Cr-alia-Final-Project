/**
 * useNavigation Hook
 * React hook for using the centralized navigation system
 */

'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { navigationManager } from './navigation-manager'
import type { ButtonAction } from './route-config'

interface UseNavigationOptions {
  user?: any
  onModalOpen?: (modalId: string) => void
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const router = useRouter()

  // Register route handler
  useEffect(() => {
    navigationManager.registerRouteHandler('default', (path: string) => {
      router.push(path)
    })
  }, [router])

  /**
   * Handle button click
   */
  const handleButtonClick = useCallback(
    async (buttonId: string) => {
      const context = {
        user: options.user,
      }
      return navigationManager.handleButtonClick(buttonId, context)
    },
    [options.user]
  )

  /**
   * Register modal handler
   */
  const registerModal = useCallback((modalId: string, handler: () => void) => {
    navigationManager.registerModalHandler(modalId, handler)
  }, [])

  /**
   * Navigate to route
   */
  const navigateTo = useCallback(
    (path: string) => {
      router.push(path)
    },
    [router]
  )

  /**
   * Get button props for a specific button ID
   */
  const getButtonProps = useCallback(
    (buttonId: string) => {
      return {
        onClick: () => handleButtonClick(buttonId),
        'data-button-id': buttonId,
      }
    },
    [handleButtonClick]
  )

  /**
   * Get all buttons for current route
   */
  const getRouteButtons = useCallback((path: string): ButtonAction[] => {
    return navigationManager.getRouteButtons(path)
  }, [])

  return {
    handleButtonClick,
    registerModal,
    navigateTo,
    getButtonProps,
    getRouteButtons,
  }
}

