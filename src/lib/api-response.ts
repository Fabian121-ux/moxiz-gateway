/**
 * @fileOverview Standard API response structure for the Moxiz platform.
 */

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
};

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7),
    },
  };
}

export function createErrorResponse(message: string, code: string, details?: any): ApiResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7),
    },
  };
}
