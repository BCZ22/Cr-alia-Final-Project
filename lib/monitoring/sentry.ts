/**
 * Sentry Error Tracking (Optional)
 * Capture and report errors to Sentry - only if installed
 */

// Sentry is optional - try to load it but don't fail if not available
let Sentry: any = null
let BrowserTracing: any = null

try {
  const SentryModule = require('@sentry/nextjs')
  Sentry = SentryModule
  BrowserTracing = SentryModule.BrowserTracing
} catch (e) {
  // Sentry not installed - that's okay, we'll just log to console
  console.log('Sentry not installed. Error tracking will use console only.')
}

/**
 * Initialize Sentry (only if installed)
 */
export function initSentry() {
  if (!Sentry) {
    return // Sentry not available
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return // No DSN configured
  }

  try {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Performance monitoring
      integrations: BrowserTracing ? [
        new BrowserTracing({
          tracePropagationTargets: ['localhost', /^https:\/\/crealia\.com/],
        }),
      ] : [],
      
      // Error filtering
      beforeSend(event: any, hint: any) {
        const error = hint.originalException as Error
        
        if (error?.message?.includes('ResizeObserver')) {
          return null
        }
        
        if (error?.message?.includes('Non-Error promise rejection')) {
          return null
        }
        
        return event
      },
    })
  } catch (error) {
    console.error('Failed to initialize Sentry:', error)
  }
}

/**
 * Capture exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error, context)
  
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.captureException(error, {
        extra: context,
      })
    } catch (e) {
      // Ignore Sentry errors
    }
  }
}

/**
 * Capture message
 */
export function captureMessage(message: string, level: string = 'info', context?: Record<string, any>) {
  console.log(`[${level}] ${message}`, context)
  
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.captureMessage(message, {
        level,
        extra: context,
      })
    } catch (e) {
      // Ignore Sentry errors
    }
  }
}

/**
 * Set user context
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.setUser(user)
    } catch (e) {
      // Ignore Sentry errors
    }
  }
}

/**
 * Clear user context
 */
export function clearUser() {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.setUser(null)
    } catch (e) {
      // Ignore Sentry errors
    }
  }
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
      })
    } catch (e) {
      // Ignore Sentry errors
    }
  }
}

/**
 * Start transaction
 */
export function startTransaction(name: string, op: string) {
  if (Sentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      return Sentry.startTransaction({
        name,
        op,
      })
    } catch (e) {
      // Ignore Sentry errors
    }
  }
  return null
}
