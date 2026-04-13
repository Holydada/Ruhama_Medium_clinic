/**
 * API Error Response Types
 * 
 * Standardized error response structure for all API endpoints
 */

export type ErrorCode =
  | 'AUTH_FAILED'        // Invalid credentials during login
  | 'TOKEN_EXPIRED'      // JWT token has expired
  | 'TOKEN_INVALID'      // JWT token is malformed or invalid
  | 'NO_TOKEN'           // No authentication token provided
  | 'OTP_REQUIRED'       // OTP verification required
  | 'FORBIDDEN'          // User lacks permission for the requested action
  | 'VALIDATION_ERROR'   // Input validation failed
  | 'NOT_FOUND'          // Requested resource not found
  | 'SERVER_ERROR';      // Internal server error

export interface ApiErrorResponse {
  success: false;
  error: string;
  errorCode?: ErrorCode;
  details?: any;
  requiresOTP?: boolean;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
