/**
 * Sentry Error Tracking
 * Capture and report errors to Sentry
 */

import * as Sentry from '@sentry/nextjs'

// This file is used to initialize Sentry on both the client and server.
// It is imported in `_app.tsx` and `_error.tsx`.

/**
 * Initialize Sentry
 */
export function initSentry() {
  const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

      //
      // Note: if you want to override the automatic release value, do this:
      //
      // release: "my-project-name@2.3.12",
      //
      
      integrations: [
        // Add any integrations you need here.
        // The Next.js SDK automatically includes many of the default integrations.
      ],
      
      // Error filtering
      beforeSend(event, hint) {
        // Don't send certain errors that are often just noise
        const error = hint.originalException as Error
        
        if (error?.message) {
            if (error.message.includes('ResizeObserver') || error.message.includes('Non-Error promise rejection')) {
                return null;
            }
        }
        
        return event
      },
    })
  }
}

/**
 * Capture exception in a Sentry-safe way
 */
export function captureException(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error, context);
  
  const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (sentryDsn) {
    Sentry.captureException(error, {
      extra: context,
    })
  }
}

/**
 * Capture a message in a Sentry-safe way
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
  const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (sentryDsn) {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    })
  }
}

/**
 * Set user context for Sentry
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (sentryDsn) {
    Sentry.setUser(user);
  }
}

/**
 * Add a breadcrumb for Sentry
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
  const sentryDsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (sentryDsn) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    })
  }
}

