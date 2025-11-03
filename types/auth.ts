// types/auth.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  status: string;
  data: User & { token: string };
  message?: string;
  verificationURL?: string;
  resetURL?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export interface ValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export interface ValidationErrorResponse {
  success: false;
  errors: ValidationError[];
}

export interface ApiErrorResponse {
  message: string;
  stack?: string;
  code?: string;
}

export interface ApiError extends Error {
  status?: number;
  validationErrors?: ValidationError[];
}

// Type guard functions
export function isValidationErrorResponse(
  data: unknown
): data is ValidationErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    "errors" in data &&
    data.success === false &&
    Array.isArray(data.errors)
  );
}

export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  );
}
