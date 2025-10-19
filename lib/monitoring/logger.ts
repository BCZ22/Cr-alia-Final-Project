/**
 * Structured Logger
 * Production-ready logging with levels and metadata
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogMetadata {
  [key: string]: any
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: LogMetadata
  error?: Error
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production'
  }

  /**
   * Format log entry
   */
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, metadata, error } = entry

    if (this.isDevelopment) {
      // Pretty format for development
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${
        metadata ? `\n  Metadata: ${JSON.stringify(metadata, null, 2)}` : ''
      }${error ? `\n  Error: ${error.stack}` : ''}`
    } else {
      // JSON format for production (structured logging)
      return JSON.stringify({
        level,
        message,
        timestamp,
        ...metadata,
        ...(error && {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }),
      })
    }
  }

  /**
   * Log entry
   */
  private log(level: LogLevel, message: string, metadata?: LogMetadata, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      error,
    }

    const formatted = this.formatLog(entry)

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted)
        break
      case LogLevel.INFO:
        console.info(formatted)
        break
      case LogLevel.WARN:
        console.warn(formatted)
        break
      case LogLevel.ERROR:
        console.error(formatted)
        break
    }
  }

  /**
   * Debug level
   */
  debug(message: string, metadata?: LogMetadata) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, metadata)
    }
  }

  /**
   * Info level
   */
  info(message: string, metadata?: LogMetadata) {
    this.log(LogLevel.INFO, message, metadata)
  }

  /**
   * Warning level
   */
  warn(message: string, metadata?: LogMetadata) {
    this.log(LogLevel.WARN, message, metadata)
  }

  /**
   * Error level
   */
  error(message: string, error?: Error, metadata?: LogMetadata) {
    this.log(LogLevel.ERROR, message, metadata, error)
  }

  /**
   * Log HTTP request
   */
  request(method: string, path: string, statusCode: number, duration: number, metadata?: LogMetadata) {
    this.info('HTTP Request', {
      method,
      path,
      statusCode,
      duration: `${duration}ms`,
      ...metadata,
    })
  }

  /**
   * Log database query
   */
  query(query: string, duration: number, metadata?: LogMetadata) {
    this.debug('Database Query', {
      query: query.substring(0, 200), // Limit query length
      duration: `${duration}ms`,
      ...metadata,
    })
  }
}

// Export singleton
export const logger = new Logger()
export default logger

