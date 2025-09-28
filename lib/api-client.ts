import {
  ApiError,
  AuthResponse,
  ForgotPasswordData,
  isApiErrorResponse,
  isValidationErrorResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  ValidationError,
} from "@/types/auth";
import {
  AddAddressData,
  AddressResponse,
  PasswordUpdateResponse,
  UpdateAddressData,
  UpdatePasswordData,
  UpdateProfileData,
  UserProfileResponse,
  UserUpdateResponse,
} from "@/types/user";

// lib/api-client.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: unknown = await response.json();

      if (!response.ok) {
        // Handle validation errors specifically
        if (response.status === 400 && isValidationErrorResponse(data)) {
          // Format validation errors into a readable message
          const errorMessages = data.errors.map(
            (error: ValidationError) => error.msg
          );
          const errorMessage = errorMessages.join(". ");

          // Create a custom error with validation details
          const validationError = new Error(errorMessage) as ApiError;
          validationError.status = response.status;
          validationError.validationErrors = data.errors;
          throw validationError;
        }

        // Handle other types of errors
        if (isApiErrorResponse(data)) {
          const apiError = new Error(data.message) as ApiError;
          apiError.status = response.status;
          throw apiError;
        }

        // Fallback error
        const fallbackError = new Error("Something went wrong") as ApiError;
        fallbackError.status = response.status;
        throw fallbackError;
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    console.log("Registration data:", userData);
    const response = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    console.log("Registration response:", response);
    return response;
  }

  async forgotPassword(
    data: ForgotPasswordData
  ): Promise<{ status: string; message: string; resetURL?: string }> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async resetPassword(
    token: string,
    data: ResetPasswordData
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({
        password: data.password,
        confirmPassword: data.confirmPassword,
      }),
    });
  }

  async verifyEmail(
    token: string
  ): Promise<{ status: string; message: string }> {
    return this.request(`/auth/verify-email/${token}`, {
      method: "GET",
    });
  }

  // User profile endpoints
  async getUserProfile(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/users/profile", {
      method: "GET",
    });
  }

  async updateUserProfile(
    data: UpdateProfileData
  ): Promise<UserUpdateResponse> {
    return this.request<UserUpdateResponse>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateUserPassword(
    data: UpdatePasswordData
  ): Promise<PasswordUpdateResponse> {
    return this.request<PasswordUpdateResponse>("/users/update-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Address endpoints
  async addUserAddress(data: AddAddressData): Promise<AddressResponse> {
    return this.request<AddressResponse>("/users/address", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUserAddress(
    addressId: string,
    data: UpdateAddressData
  ): Promise<AddressResponse> {
    return this.request<AddressResponse>(`/users/address/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUserAddress(addressId: string): Promise<AddressResponse> {
    return this.request<AddressResponse>(`/users/address/${addressId}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
