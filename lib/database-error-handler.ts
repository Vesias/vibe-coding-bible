/**
 * Database Error Handler for Vibe Coding Bible
 * Provides consistent error handling and user-friendly messages
 */

export interface DatabaseError {
  code: string
  message: string
  details?: string
  hint?: string
}

export interface ErrorHandlerResult {
  success: boolean
  error?: {
    type: 'database' | 'auth' | 'validation' | 'network' | 'setup'
    message: string
    userMessage: string
    code?: string
    setupRequired?: boolean
    retryable?: boolean
  }
}

/**
 * Maps Supabase/PostgreSQL error codes to user-friendly messages
 */
const ERROR_CODE_MAP: Record<string, { type: string; userMessage: string; retryable: boolean }> = {
  // Table/Schema errors
  'PGRST116': {
    type: 'setup',
    userMessage: 'The database tables are not set up yet. Please contact the administrator to run the database migration.',
    retryable: false
  },
  '42P01': {
    type: 'setup',
    userMessage: 'Database tables are missing. The system needs to be configured by an administrator.',
    retryable: false
  },
  
  // Authentication errors
  'PGRST301': {
    type: 'auth',
    userMessage: 'You need to be signed in to access this resource.',
    retryable: false
  },
  'PGRST103': {
    type: 'auth',
    userMessage: 'You do not have permission to access this resource.',
    retryable: false
  },
  
  // Data validation errors
  '23505': {
    type: 'validation',
    userMessage: 'This record already exists. Please use different values.',
    retryable: false
  },
  '23502': {
    type: 'validation',
    userMessage: 'Required information is missing. Please fill in all required fields.',
    retryable: false
  },
  '23503': {
    type: 'validation',
    userMessage: 'Referenced data not found. Please check your inputs.',
    retryable: false
  },
  
  // Network/Connection errors
  'ECONNREFUSED': {
    type: 'network',
    userMessage: 'Unable to connect to the database. Please try again in a moment.',
    retryable: true
  },
  'ETIMEDOUT': {
    type: 'network',
    userMessage: 'Database connection timed out. Please try again.',
    retryable: true
  },
  
  // Generic database errors
  'PGRST000': {
    type: 'database',
    userMessage: 'A database error occurred. Please try again or contact support.',
    retryable: true
  }
}

/**
 * Handles database errors and returns structured error information
 */
export function handleDatabaseError(error: any): ErrorHandlerResult {
  // If no error, return success
  if (!error) {
    return { success: true }
  }

  // Extract error information
  const code = error.code || error.error_code || 'UNKNOWN'
  const message = error.message || error.error_description || 'Unknown error'
  const details = error.details || error.error_details || ''
  const hint = error.hint || error.error_hint || ''

  // Check for specific error codes
  const mappedError = ERROR_CODE_MAP[code]
  
  if (mappedError) {
    return {
      success: false,
      error: {
        type: mappedError.type as any,
        message: `${message}${details ? ` - ${details}` : ''}`,
        userMessage: mappedError.userMessage,
        code,
        setupRequired: mappedError.type === 'setup',
        retryable: mappedError.retryable
      }
    }
  }

  // Handle auth-specific errors
  if (message.includes('Invalid API key') || message.includes('JWT')) {
    return {
      success: false,
      error: {
        type: 'auth',
        message,
        userMessage: 'Authentication failed. Please sign in again.',
        code,
        retryable: false
      }
    }
  }

  // Handle network errors
  if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
    return {
      success: false,
      error: {
        type: 'network',
        message,
        userMessage: 'Connection problem. Please check your internet and try again.',
        code,
        retryable: true
      }
    }
  }

  // Handle validation errors
  if (message.includes('invalid') || message.includes('format') || message.includes('required')) {
    return {
      success: false,
      error: {
        type: 'validation',
        message,
        userMessage: 'Please check your input and try again.',
        code,
        retryable: false
      }
    }
  }

  // Handle table/schema missing errors
  if (message.includes('does not exist') || message.includes('relation')) {
    return {
      success: false,
      error: {
        type: 'setup',
        message,
        userMessage: 'The system is not fully configured. Please contact support.',
        code,
        setupRequired: true,
        retryable: false
      }
    }
  }

  // Default fallback
  return {
    success: false,
    error: {
      type: 'database',
      message,
      userMessage: 'An unexpected error occurred. Please try again or contact support if the problem persists.',
      code,
      retryable: true
    }
  }
}

/**
 * Wraps database operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  context?: string
): Promise<{ data: T | null; error: ErrorHandlerResult['error'] | null }> {
  try {
    const result = await operation()
    
    if (result.error) {
      const errorResult = handleDatabaseError(result.error)
      return {
        data: null,
        error: errorResult.error || null
      }
    }
    
    return {
      data: result.data,
      error: null
    }
  } catch (err) {
    const errorResult = handleDatabaseError(err)
    return {
      data: null,
      error: errorResult.error || null
    }
  }
}

/**
 * Creates a standardized API error response
 */
export function createErrorResponse(error: ErrorHandlerResult['error'], statusCode?: number) {
  const status = statusCode || (error?.setupRequired ? 503 : error?.type === 'auth' ? 401 : 500)
  
  return {
    success: false,
    message: error?.userMessage || 'An error occurred',
    error: error?.message || 'Unknown error',
    code: error?.code,
    type: error?.type,
    setupRequired: error?.setupRequired || false,
    retryable: error?.retryable || false,
    timestamp: new Date().toISOString()
  }
}

/**
 * Logs errors with context
 */
export function logError(error: any, context: string, userId?: string) {
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    userId,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      stack: error.stack
    }
  }
  
  console.error(`[${context}] Database Error:`, logData)
}