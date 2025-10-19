/**
 * Navigation Manager
 * Handles all navigation logic, button clicks, and routing
 */

import { ROUTES, getButtonAction, type ButtonAction } from './route-config'

export class NavigationManager {
  private static instance: NavigationManager
  private modalHandlers: Map<string, () => void> = new Map()
  private routeHandlers: Map<string, (path: string) => void> = new Map()

  private constructor() {}

  static getInstance(): NavigationManager {
    if (!NavigationManager.instance) {
      NavigationManager.instance = new NavigationManager()
    }
    return NavigationManager.instance
  }

  /**
   * Register a modal handler (e.g., signup-dark modal)
   */
  registerModalHandler(modalId: string, handler: () => void) {
    this.modalHandlers.set(modalId, handler)
  }

  /**
   * Register a route handler (e.g., Next.js router.push)
   */
  registerRouteHandler(handlerId: string, handler: (path: string) => void) {
    this.routeHandlers.set(handlerId, handler)
  }

  /**
   * Handle button click by ID
   */
  async handleButtonClick(buttonId: string, context?: any): Promise<boolean> {
    const action = getButtonAction(buttonId)
    
    if (!action) {
      console.warn(`No action found for button: ${buttonId}`)
      return false
    }

    // Check auth requirement
    if (action.requiresAuth && !context?.user) {
      // Redirect to login
      const loginHandler = this.modalHandlers.get('signup')
      if (loginHandler) {
        loginHandler()
      }
      return false
    }

    // Execute action based on type
    switch (action.type) {
      case 'modal':
        return this.handleModalAction(action)
      
      case 'route':
        return this.handleRouteAction(action)
      
      case 'external':
        return this.handleExternalAction(action)
      
      case 'api':
        return this.handleApiAction(action, context)
      
      default:
        console.warn(`Unknown action type: ${action.type}`)
        return false
    }
  }

  /**
   * Handle modal action
   */
  private handleModalAction(action: ButtonAction): boolean {
    const handler = this.modalHandlers.get(action.target || '')
    if (handler) {
      handler()
      return true
    }
    console.warn(`No modal handler registered for: ${action.target}`)
    return false
  }

  /**
   * Handle route navigation
   */
  private handleRouteAction(action: ButtonAction): boolean {
    const handler = this.routeHandlers.get('default')
    if (handler && action.target) {
      handler(action.target)
      return true
    }
    console.warn(`No route handler registered or no target specified`)
    return false
  }

  /**
   * Handle external link
   */
  private handleExternalAction(action: ButtonAction): boolean {
    if (action.target) {
      window.open(action.target, '_blank', 'noopener,noreferrer')
      return true
    }
    return false
  }

  /**
   * Handle API action
   */
  private async handleApiAction(action: ButtonAction, context?: any): Promise<boolean> {
    if (!action.target) {
      console.warn('API action missing target endpoint')
      return false
    }

    try {
      // Custom handler if specified
      if (action.handler && this.routeHandlers.has(action.handler)) {
        const handler = this.routeHandlers.get(action.handler)!
        handler(action.target)
        return true
      }

      // Default API call
      const response = await fetch(action.target, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(context || {}),
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Handle redirect responses (e.g., Stripe checkout)
      if (data.url) {
        window.location.href = data.url
        return true
      }

      return true
    } catch (error) {
      console.error('API action failed:', error)
      return false
    }
  }

  /**
   * Get all buttons for a route
   */
  getRouteButtons(path: string): ButtonAction[] {
    const route = Object.values(ROUTES).find(r => r.path === path)
    return route?.buttons || []
  }

  /**
   * Generate button props for React components
   */
  generateButtonProps(buttonId: string, context?: any) {
    return {
      onClick: () => this.handleButtonClick(buttonId, context),
      'data-button-id': buttonId,
    }
  }
}

export const navigationManager = NavigationManager.getInstance()

