// types/common.ts

/**
 * Standardized pagination metadata
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Generic paginated response wrapper
 * Use this for consistent API responses across all resources
 */
export interface PaginatedResponse<T> {
  status: string;
  results: number;
  data: T[];
  pagination: Pagination;
}

/**
 * Standard API response wrapper for single items
 */
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data: T;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  status: string;
  message: string;
  code?: string;
  stack?: string;
}

/**
 * Validation error structure
 */
export interface ValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

/**
 * Base query parameters for listing endpoints
 */
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Base search parameters
 */
export interface BaseSearchParams extends BaseQueryParams {
  q: string; // Search query
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  status: string;
  message: string;
  data: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse {
  status: string;
  message: string;
  data?: {
    modifiedCount?: number;
    deletedCount?: number;
    successCount?: number;
    failedCount?: number;
    errors?: Array<{
      id: string;
      error: string;
    }>;
  };
}

/**
 * Delete operation response
 */
export interface DeleteResponse {
  status: string;
  message: string;
}

/**
 * Toggle status response
 */
export interface ToggleStatusResponse<T> {
  status: string;
  message: string;
  data: T;
}
