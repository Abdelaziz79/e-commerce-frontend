import { ValidationError } from "@/types/auth";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public validationErrors?: ValidationError[],
    public code?: string
  ) {
    super(message);
    this.name = "ApiClientError";
    Object.setPrototypeOf(this, ApiClientError.prototype);
  }

  /**
   * Check if error is a validation error
   */
  isValidationError(): boolean {
    return !!this.validationErrors?.length;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if error is a permission error
   */
  isPermissionError(): boolean {
    return this.status === 403;
  }

  /**
   * Check if error is a not found error
   */
  isNotFoundError(): boolean {
    return this.status === 404;
  }

  /**
   * Check if error is a server error
   */
  isServerError(): boolean {
    return !!this.status && this.status >= 500;
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(): boolean {
    return !this.status;
  }
}
