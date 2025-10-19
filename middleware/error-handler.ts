/**
 * Global Error Handler Middleware
 * Catch and handle API errors consistently
 */

import { NextResponse } from 'next/server'
import { logger } from '@/lib/monitoring/logger'
import { captureException } from '@/lib/monitoring/sentry'

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

/**
 * Standard error response
 */
export interface ErrorResponse {
  error: string
  message: string
  code?: string
  statusCode: number
  timestamp: string
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: Error | ApiError,
  statusCode: number = 500
): NextResponse<ErrorResponse> {
  const apiError = error as ApiError

  const response: ErrorResponse = {
    error: apiError.name || 'Error',
    message: apiError.message || 'An error occurred',
    code: apiError.code,
    statusCode: apiError.statusCode || statusCode,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(response, { status: response.statusCode })
}

/**
 * Handle API error
 */
export function handleApiError(error: Error | ApiError, context?: Record<string, any>) {
  const apiError = error as ApiError

  // Log error
  logger.error('API Error', error, context)

  // Capture in Sentry (production only)
  if (process.env.NODE_ENV === 'production') {
    captureException(error, context)
  }

  // Return appropriate response
  return createErrorResponse(error, apiError.statusCode || 500)
}

/**
 * Async error wrapper
 */
export function asyncHandler(
  handler: (req: any, context?: any) => Promise<NextResponse>
) {
  return async (req: any, context?: any) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleApiError(error as Error, {
        url: req.url,
        method: req.method,
      })
    }
  }
}

/**
 * Standard error classes
 */
export class BadRequestError extends Error implements ApiError {
  statusCode = 400
  code = 'BAD_REQUEST'

  constructor(message: string = 'Bad Request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends Error implements ApiError {
  statusCode = 401
  code = 'UNAUTHORIZED'

  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error implements ApiError {
  statusCode = 403
  code = 'FORBIDDEN'

  constructor(message: string = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error implements ApiError {
  statusCode = 404
  code = 'NOT_FOUND'

  constructor(message: string = 'Not Found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends Error implements ApiError {
  statusCode = 409
  code = 'CONFLICT'

  constructor(message: string = 'Conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class TooManyRequestsError extends Error implements ApiError {
  statusCode = 429
  code = 'TOO_MANY_REQUESTS'

  constructor(message: string = 'Too Many Requests') {
    super(message)
    this.name = 'TooManyRequestsError'
  }
}

export class InternalServerError extends Error implements ApiError {
  statusCode = 500
  code = 'INTERNAL_SERVER_ERROR'

  constructor(message: string = 'Internal Server Error') {
    super(message)
    this.name = 'InternalServerError'
  }
}

