// lib/api-client.ts

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// --- CORE & AUTH IMPORTS ---
import {
  AuthResponse,
  ForgotPasswordData,
  isApiErrorResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
  ValidationError,
} from "@/types/auth";

// --- USER IMPORTS ---
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

import { AddToCartData, CartResponse, UpdateCartItemData } from "@/types/cart";
import {
  AddToFavoritesResponse,
  FavoritesResponse,
  RemoveFromFavoritesResponse,
} from "@/types/favorite";

import {
  AddTrackingInfoData,
  CancelOrderData,
  CreateOrderData,
  OrderAnalyticsResponse,
  OrderHistoryResponse,
  OrderResponse,
  OrdersParams,
  OrderStatsResponse,
  PaginatedOrdersResponse,
  SearchOrdersParams,
  UpdateOrderStatusData,
  UpdateToPaidData,
} from "@/types/order";

// --- PRODUCT IMPORTS ---
import {
  BulkDeleteData,
  BulkOperationResponse,
  BulkUpdateData,
  CreateProductData,
  LowStockParams,
  PaginatedProductsResponse,
  ProductListResponse,
  ProductResponse,
  ProductsParams,
  ProductStatsResponse,
  SearchProductsParams,
  StockAdjustmentData,
  UpdateProductData,
} from "@/types/product";

// --- MODEL IMPORTS ---
import {
  BrandResponse,
  BrandSearchParams,
  BrandsParams,
  CreateBrandData,
  PaginatedBrandsResponse,
  UpdateBrandData,
} from "@/types/brand";
import {
  CategoriesParams,
  CategoryResponse,
  CategorySearchParams,
  CreateCategoryData,
  PaginatedCategoriesResponse,
  UpdateCategoryData,
} from "@/types/category";
import {
  CreateReviewData,
  MyReviewsResponse,
  PaginatedReviewsResponse,
  ReviewResponse,
  ReviewsParams,
  ReviewStatsResponse,
  UpdateReviewData,
  VoteReviewResponse,
} from "@/types/review";

// ==================== CONFIGURATION ====================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const TOKEN_KEY = "auth_token";
const REQUEST_TIMEOUT = 30000; // 30 seconds

// ==================== TYPES ====================

interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

// ==================== ERROR HANDLING ====================

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

// ==================== TOKEN STORAGE ====================

export class TokenStorage {
  private static instance: TokenStorage;
  private tokenKey = TOKEN_KEY;

  private constructor() {}

  static getInstance(): TokenStorage {
    if (!TokenStorage.instance) {
      TokenStorage.instance = new TokenStorage();
    }
    return TokenStorage.instance;
  }

  get(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(this.tokenKey);
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      return null;
    }
  }

  set(token: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  }

  remove(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  }
}

// ==================== API CLIENT ====================

class ApiClient {
  private axiosInstance: AxiosInstance;
  private tokenStorage: TokenStorage;
  private requestQueue: Map<string, AbortController> = new Map();

  constructor(baseURL: string) {
    this.tokenStorage = TokenStorage.getInstance();
    this.axiosInstance = axios.create({
      baseURL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup Axios interceptors for auth and error handling
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token unless explicitly skipped
        if (!config.headers?.skipAuth) {
          const token = this.tokenStorage.get();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Remove custom headers that shouldn't be sent
        delete config.headers?.skipAuth;

        // CRITICAL FIX: Remove Content-Type for FormData
        // Let browser set it automatically with boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.handleError(error);

        // Auto logout on 401
        if (apiError.isAuthError()) {
          this.handleAuthError();
        }

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(): void {
    this.tokenStorage.remove();

    // Only redirect if we're in the browser
    if (typeof window !== "undefined") {
      // You can dispatch an event or use a callback here
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
  }

  /**
   * Enhanced error handler with better categorization
   */
  private handleError(error: AxiosError): ApiClientError {
    // Network error
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        return new ApiClientError(
          "Request timeout. Please try again.",
          undefined,
          undefined,
          "TIMEOUT"
        );
      }
      return new ApiClientError(
        "Network error. Please check your connection.",
        undefined,
        undefined,
        "NETWORK_ERROR"
      );
    }

    const { status, data } = error.response;

    // Validation errors
    if (
      typeof data === "object" &&
      data !== null &&
      "errors" in data &&
      Array.isArray(data.errors)
    ) {
      const errorMessages = data.errors
        .map((err: ValidationError) => err.msg)
        .filter(Boolean);

      return new ApiClientError(
        errorMessages.join(". ") || "Validation error occurred.",
        status,
        data.errors,
        "VALIDATION_ERROR"
      );
    }

    // API error with message
    if (isApiErrorResponse(data)) {
      return new ApiClientError(data.message, status, undefined, data.code);
    }

    // HTTP status-based errors
    const errorMessages: Record<number, string> = {
      400: "Bad request. Please check your input.",
      401: "Authentication required. Please log in.",
      403: "You don't have permission to perform this action.",
      404: "The requested resource was not found.",
      409: "Conflict. The resource already exists.",
      422: "Invalid data provided.",
      429: "Too many requests. Please try again later.",
      500: "Server error. Please try again later.",
      502: "Bad gateway. Please try again later.",
      503: "Service unavailable. Please try again later.",
    };

    const message = errorMessages[status] || "An unexpected error occurred.";

    return new ApiClientError(message, status, undefined, `HTTP_${status}`);
  }

  /**
   * Create query string from params object
   */
  private createQueryString(params: Record<string, unknown>): string {
    const cleanParams: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          cleanParams[key] = value.join(",");
        } else {
          cleanParams[key] = String(value);
        }
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * Helper to create FormData or JSON body
   * Handles single files, arrays of files, and regular data
   */
  private createRequestBody(
    data: Record<string, unknown>,
    fileFields: string[] = []
  ): FormData | Record<string, unknown> {
    // Check if any file field contains a File or File[]
    const hasFile = fileFields.some((field) => {
      const value = data[field];
      if (value instanceof File) return true;
      if (Array.isArray(value) && value.length > 0 && value[0] instanceof File)
        return true;
      return false;
    });

    if (hasFile) {
      const formData = new FormData();
      let mainImageFile: File | null = null;
      let mainImageIndex: number = -1;

      // First pass: check if mainImage is in images array
      if (data.mainImage instanceof File && Array.isArray(data.images)) {
        const mainImg = data.mainImage;
        mainImageIndex = data.images.findIndex(
          (img: File) =>
            img instanceof File &&
            img.name === mainImg.name &&
            img.size === mainImg.size &&
            img.lastModified === mainImg.lastModified
        );

        if (mainImageIndex === -1) {
          // mainImage is NOT in images array, need to upload separately
          mainImageFile = mainImg;
        }
      }

      Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return; // Skip null/undefined values
        }

        // Skip mainImage processing here - handled separately
        if (key === "mainImage") {
          return;
        }

        // Handle File objects
        if (value instanceof File) {
          formData.append(key, value);
        }
        // Handle arrays of Files (like images)
        else if (
          Array.isArray(value) &&
          value.length > 0 &&
          value[0] instanceof File
        ) {
          value.forEach((file: File) => {
            formData.append(key, file);
          });
        }
        // Handle regular arrays (not Files)
        else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        }
        // Handle objects (but not Date or File)
        else if (typeof value === "object" && !(value instanceof Date)) {
          formData.append(key, JSON.stringify(value));
        }
        // Handle primitive values
        else {
          formData.append(key, String(value));
        }
      });

      // Handle mainImage after other fields
      if (mainImageFile) {
        // Upload mainImage as separate file
        formData.append("mainImage", mainImageFile);
      } else if (mainImageIndex >= 0) {
        // mainImage is in images array, send index
        formData.append("mainImageIndex", String(mainImageIndex));
      }

      return formData;
    }

    return data;
  }

  /**
   * Generic request method with better type safety
   */
  private async request<T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }

  /**
   * Cancel pending requests for a specific endpoint
   */
  cancelRequest(endpoint: string): void {
    const controller = this.requestQueue.get(endpoint);
    if (controller) {
      controller.abort();
      this.requestQueue.delete(endpoint);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.requestQueue.forEach((controller) => controller.abort());
    this.requestQueue.clear();
  }

  // ==================== AUTH ENDPOINTS ====================

  login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return this.request<AuthResponse>("post", "/auth/login", credentials);
  };

  register = async (userData: RegisterData): Promise<AuthResponse> => {
    return this.request<AuthResponse>("post", "/auth/register", userData);
  };

  forgotPassword = async (
    data: ForgotPasswordData
  ): Promise<{ message: string }> => {
    return this.request<{ message: string }>(
      "post",
      "/auth/forgot-password",
      data
    );
  };

  resetPassword = async (
    token: string,
    data: ResetPasswordData
  ): Promise<AuthResponse> => {
    return this.request<AuthResponse>(
      "post",
      `/auth/reset-password/${token}`,
      data
    );
  };

  verifyEmail = async (token: string): Promise<{ message: string }> => {
    return this.request<{ message: string }>(
      "get",
      `/auth/verify-email/${token}`
    );
  };

  logout = (): void => {
    this.tokenStorage.remove();
    this.cancelAllRequests();
  };

  // ==================== USER PROFILE ENDPOINTS ====================

  getUserProfile = async (): Promise<UserProfileResponse> => {
    return this.request<UserProfileResponse>("get", "/users/profile");
  };

  updateUserProfile = async (
    data: UpdateProfileData
  ): Promise<UserUpdateResponse> => {
    return this.request<UserUpdateResponse>("put", "/users/profile", data);
  };

  updateUserPassword = async (
    data: UpdatePasswordData
  ): Promise<PasswordUpdateResponse> => {
    return this.request<PasswordUpdateResponse>(
      "put",
      "/users/update-password",
      data
    );
  };

  // ==================== USER AVATAR ENDPOINTS ====================

  /**
   * Upload or update user avatar
   */
  uploadAvatar = async (
    file: File
  ): Promise<{ status: string; message: string; data: { avatar: string } }> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.request<{
      status: string;
      message: string;
      data: { avatar: string };
    }>("put", "/users/avatar", formData);
  };

  /**
   * Delete user avatar (reset to default)
   */
  deleteAvatar = async (): Promise<{
    status: string;
    message: string;
    data: { avatar: string };
  }> => {
    return this.request<{
      status: string;
      message: string;
      data: { avatar: string };
    }>("delete", "/users/avatar");
  };

  // ==================== ADDRESS ENDPOINTS ====================

  addUserAddress = async (data: AddAddressData): Promise<AddressResponse> => {
    return this.request<AddressResponse>("post", "/users/address", data);
  };

  updateUserAddress = async (
    addressId: string,
    data: UpdateAddressData
  ): Promise<AddressResponse> => {
    return this.request<AddressResponse>(
      "put",
      `/users/address/${addressId}`,
      data
    );
  };

  deleteUserAddress = async (addressId: string): Promise<AddressResponse> => {
    return this.request<AddressResponse>(
      "delete",
      `/users/address/${addressId}`
    );
  };

  // ==================== CART ENDPOINTS ====================

  getCart = async (): Promise<CartResponse> => {
    return this.request<CartResponse>("get", "/users/cart");
  };

  addToCart = async (data: AddToCartData): Promise<CartResponse> => {
    return this.request<CartResponse>("post", "/users/cart", data);
  };

  updateCartItem = async (
    productId: string,
    data: UpdateCartItemData
  ): Promise<CartResponse> => {
    return this.request<CartResponse>("put", `/users/cart/${productId}`, data);
  };

  removeFromCart = async (
    productId: string,
    variationSku?: string
  ): Promise<CartResponse> => {
    const endpoint = variationSku
      ? `/users/cart/${productId}?variationSku=${variationSku}`
      : `/users/cart/${productId}`;

    return this.request<CartResponse>("delete", endpoint);
  };

  clearCart = async (): Promise<CartResponse> => {
    return this.request<CartResponse>("delete", "/users/cart");
  };

  // ==================== FAVORITES ENDPOINTS ====================

  getFavorites = async (
    params: ProductsParams = {}
  ): Promise<FavoritesResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<FavoritesResponse>(
      "get",
      `/users/favorites${queryString}`
    );
  };

  addToFavorites = async (
    productId: string
  ): Promise<AddToFavoritesResponse> => {
    return this.request<AddToFavoritesResponse>("post", "/users/favorites", {
      productId,
    });
  };

  removeFromFavorites = async (
    productId: string
  ): Promise<RemoveFromFavoritesResponse> => {
    return this.request<RemoveFromFavoritesResponse>(
      "delete",
      `/users/favorites/${productId}`
    );
  };

  // ==================== ORDER HISTORY ENDPOINT ====================

  getOrderHistory = async (
    params: ProductsParams = {}
  ): Promise<OrderHistoryResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<OrderHistoryResponse>(
      "get",
      `/users/orders${queryString}`
    );
  };

  // ==================== PRODUCT ENDPOINTS ====================

  /**
   * Search products by query
   */
  searchProducts = async (
    params: SearchProductsParams
  ): Promise<PaginatedProductsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedProductsResponse>(
      "get",
      `/products/search${queryString}`
    );
  };

  /**
   * Get product statistics (Admin only)
   */
  getProductStats = async (): Promise<ProductStatsResponse> => {
    return this.request<ProductStatsResponse>("get", "/products/stats");
  };

  /**
   * Get low stock products (Admin only)
   */
  getLowStockProducts = async (
    params: LowStockParams = {}
  ): Promise<ProductListResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<ProductListResponse>(
      "get",
      `/products/low-stock${queryString}`
    );
  };

  /**
   * Bulk update products (Admin only)
   */
  bulkUpdateProducts = async (
    data: BulkUpdateData
  ): Promise<BulkOperationResponse> => {
    return this.request<BulkOperationResponse>("patch", "/products/bulk", data);
  };

  /**
   * Bulk delete products (Admin only)
   */
  bulkDeleteProducts = async (
    data: BulkDeleteData
  ): Promise<BulkOperationResponse> => {
    return this.request<BulkOperationResponse>(
      "delete",
      "/products/bulk",
      data
    );
  };

  /**
   * Adjust product stock (Admin only)
   */
  adjustProductStock = async (
    productId: string,
    data: StockAdjustmentData
  ): Promise<ProductResponse> => {
    return this.request<ProductResponse>(
      "patch",
      `/products/${productId}/stock`,
      data
    );
  };

  getProducts = async (
    params: ProductsParams = {}
  ): Promise<PaginatedProductsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedProductsResponse>(
      "get",
      `/products${queryString}`
    );
  };

  getFeaturedProducts = async (limit = 5): Promise<ProductListResponse> => {
    return this.request<ProductListResponse>(
      "get",
      `/products/featured?limit=${limit}`
    );
  };

  getOnSaleProducts = async (limit = 10): Promise<ProductListResponse> => {
    return this.request<ProductListResponse>(
      "get",
      `/products/sale?limit=${limit}`
    );
  };

  getProductById = async (id: string): Promise<ProductResponse> => {
    return this.request<ProductResponse>("get", `/products/${id}`);
  };

  /**
   * Create product with file upload support
   */
  createProduct = async (data: CreateProductData): Promise<ProductResponse> => {
    const body = this.createRequestBody(
      data as unknown as Record<string, unknown>,
      ["images", "mainImage"]
    );
    return this.request<ProductResponse>("post", "/products", body);
  };

  /**
   * Update product with file upload support
   */
  updateProduct = async (
    productId: string,
    data: UpdateProductData
  ): Promise<ProductResponse> => {
    const body = this.createRequestBody(
      data as unknown as Record<string, unknown>,
      ["images", "mainImage"]
    );
    return this.request<ProductResponse>("put", `/products/${productId}`, body);
  };

  deleteProduct = async (
    productId: string
  ): Promise<{ status: string; message: string }> => {
    return this.request<{ status: string; message: string }>(
      "delete",
      `/products/${productId}`
    );
  };

  // ==================== CATEGORY ENDPOINTS ====================

  getCategories = async (
    params: CategoriesParams = {}
  ): Promise<PaginatedCategoriesResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedCategoriesResponse>(
      "get",
      `/categories${queryString}`
    );
  };

  getAdminCategories = async (
    params: CategoriesParams = {}
  ): Promise<PaginatedCategoriesResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedCategoriesResponse>(
      "get",
      `/categories/admin/all${queryString}`
    );
  };

  searchCategories = async (
    params: CategorySearchParams
  ): Promise<PaginatedCategoriesResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedCategoriesResponse>(
      "get",
      `/categories/search${queryString}`
    );
  };

  searchAdminCategories = async (
    params: CategorySearchParams
  ): Promise<PaginatedCategoriesResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedCategoriesResponse>(
      "get",
      `/categories/admin/search${queryString}`
    );
  };

  getCategoryById = async (id: string): Promise<CategoryResponse> => {
    return this.request<CategoryResponse>("get", `/categories/${id}`);
  };

  createCategory = async (
    data: CreateCategoryData
  ): Promise<CategoryResponse> => {
    const body = this.createRequestBody(
      data as unknown as Record<string, unknown>,
      ["image"]
    );
    return this.request<CategoryResponse>("post", "/categories", body, {
      headers:
        body instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    });
  };

  updateCategory = async (
    categoryId: string,
    data: UpdateCategoryData
  ): Promise<CategoryResponse> => {
    const body = this.createRequestBody(data as Record<string, unknown>, [
      "image",
    ]);
    return this.request<CategoryResponse>(
      "put",
      `/categories/${categoryId}`,
      body,
      {
        headers:
          body instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      }
    );
  };

  deleteCategory = async (categoryId: string): Promise<void> => {
    return this.request<void>("delete", `/categories/${categoryId}`);
  };

  toggleCategoryActive = async (
    categoryId: string
  ): Promise<CategoryResponse> => {
    return this.request<CategoryResponse>(
      "put",
      `/categories/${categoryId}/toggle-active`
    );
  };

  // ==================== BRAND ENDPOINTS ====================

  getBrands = async (
    params: BrandsParams = {}
  ): Promise<PaginatedBrandsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedBrandsResponse>(
      "get",
      `/brands${queryString}`
    );
  };

  getAdminBrands = async (
    params: BrandsParams = {}
  ): Promise<PaginatedBrandsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedBrandsResponse>(
      "get",
      `/brands/admin/all${queryString}`
    );
  };

  searchBrands = async (
    params: BrandSearchParams
  ): Promise<PaginatedBrandsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedBrandsResponse>(
      "get",
      `/brands/search${queryString}`
    );
  };

  searchAdminBrands = async (
    params: BrandSearchParams
  ): Promise<PaginatedBrandsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedBrandsResponse>(
      "get",
      `/brands/admin/search${queryString}`
    );
  };

  getBrandById = async (id: string): Promise<BrandResponse> => {
    return this.request<BrandResponse>("get", `/brands/${id}`);
  };

  createBrand = async (data: CreateBrandData): Promise<BrandResponse> => {
    const body = this.createRequestBody(
      data as unknown as Record<string, unknown>,
      ["logo"]
    );
    return this.request<BrandResponse>("post", "/brands", body, {
      headers:
        body instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    });
  };

  updateBrand = async (
    brandId: string,
    data: UpdateBrandData
  ): Promise<BrandResponse> => {
    const body = this.createRequestBody(data as Record<string, unknown>, [
      "logo",
    ]);
    return this.request<BrandResponse>("put", `/brands/${brandId}`, body, {
      headers:
        body instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    });
  };

  deleteBrand = async (brandId: string): Promise<void> => {
    return this.request<void>("delete", `/brands/${brandId}`);
  };

  toggleBrandActive = async (brandId: string): Promise<BrandResponse> => {
    return this.request<BrandResponse>(
      "put",
      `/brands/${brandId}/toggle-active`
    );
  };

  // ==================== REVIEW ENDPOINTS ====================

  getReviews = async (
    params: ReviewsParams = {}
  ): Promise<PaginatedReviewsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedReviewsResponse>(
      "get",
      `/reviews${queryString}`
    );
  };

  getReviewById = async (id: string): Promise<ReviewResponse> => {
    return this.request<ReviewResponse>("get", `/reviews/${id}`);
  };

  createReview = async (data: CreateReviewData): Promise<ReviewResponse> => {
    const requestData: Record<string, unknown> = {
      product: data.product,
      rating: data.rating,
      comment: data.comment,
    };

    if (data.title) {
      requestData.title = data.title;
    }
    if (data.images && data.images.length > 0) {
      requestData.images = data.images;
    }

    const body = this.createRequestBody(requestData, ["images"]);
    return this.request<ReviewResponse>("post", "/reviews", body);
  };

  updateReview = async (
    reviewId: string,
    data: UpdateReviewData
  ): Promise<ReviewResponse> => {
    const requestData: Record<string, unknown> = {};

    if (data.rating !== undefined) requestData.rating = data.rating;
    if (data.comment !== undefined) requestData.comment = data.comment;
    if (data.title !== undefined) requestData.title = data.title;
    if (data.images && data.images.length > 0) requestData.images = data.images;

    const body = this.createRequestBody(requestData, ["images"]);
    return this.request<ReviewResponse>("put", `/reviews/${reviewId}`, body);
  };

  deleteReview = async (reviewId: string): Promise<void> => {
    return this.request<void>("delete", `/reviews/${reviewId}`);
  };

  voteReviewHelpful = async (reviewId: string): Promise<VoteReviewResponse> => {
    return this.request<VoteReviewResponse>(
      "post",
      `/reviews/${reviewId}/helpful`
    );
  };

  getMyReviews = async (
    params: ReviewsParams = {}
  ): Promise<MyReviewsResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<MyReviewsResponse>(
      "get",
      `/reviews/my-reviews${queryString}`
    );
  };

  getProductReviewStats = async (
    productId: string
  ): Promise<ReviewStatsResponse> => {
    return this.request<ReviewStatsResponse>(
      "get",
      `/reviews/stats/${productId}`
    );
  };
  // ==================== ORDER ENDPOINTS ====================

  createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
    return this.request<OrderResponse>("post", "/orders", data);
  };

  getMyOrders = async (
    params: OrdersParams = {}
  ): Promise<PaginatedOrdersResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedOrdersResponse>(
      "get",
      `/orders/myorders${queryString}`
    );
  };

  getUserOrderStats = async (): Promise<OrderStatsResponse> => {
    return this.request<OrderStatsResponse>("get", "/orders/user-stats");
  };

  getOrders = async (
    params: OrdersParams = {}
  ): Promise<PaginatedOrdersResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedOrdersResponse>(
      "get",
      `/orders${queryString}`
    );
  };

  searchOrders = async (
    params: SearchOrdersParams
  ): Promise<PaginatedOrdersResponse> => {
    const queryString = this.createQueryString(params);
    return this.request<PaginatedOrdersResponse>(
      "get",
      `/orders/search${queryString}`
    );
  };

  getOrderAnalytics = async (): Promise<OrderAnalyticsResponse> => {
    return this.request<OrderAnalyticsResponse>("get", "/orders/analytics");
  };

  exportOrders = async (params: OrdersParams = {}): Promise<Blob> => {
    const queryString = this.createQueryString(params);
    const response = await this.axiosInstance.get(
      `/orders/export${queryString}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  };

  getOrderById = async (orderId: string): Promise<OrderResponse> => {
    return this.request<OrderResponse>("get", `/orders/${orderId}`);
  };

  updateOrderToPaid = async (
    orderId: string,
    data: UpdateToPaidData
  ): Promise<OrderResponse> => {
    return this.request<OrderResponse>("put", `/orders/${orderId}/pay`, data);
  };

  updateOrderStatus = async (
    orderId: string,
    data: UpdateOrderStatusData
  ): Promise<OrderResponse> => {
    return this.request<OrderResponse>(
      "put",
      `/orders/${orderId}/status`,
      data
    );
  };

  updateOrderToDelivered = async (
    orderId: string,
    data?: { note?: string }
  ): Promise<OrderResponse> => {
    return this.request<OrderResponse>(
      "put",
      `/orders/${orderId}/deliver`,
      data
    );
  };

  addTrackingInfo = async (
    orderId: string,
    data: AddTrackingInfoData
  ): Promise<OrderResponse> => {
    return this.request<OrderResponse>(
      "put",
      `/orders/${orderId}/tracking`,
      data
    );
  };

  cancelOrder = async (
    orderId: string,
    data: CancelOrderData
  ): Promise<OrderResponse> => {
    return this.request<OrderResponse>(
      "put",
      `/orders/${orderId}/cancel`,
      data
    );
  };
}

// ==================== EXPORTS ====================

export const apiClient = new ApiClient(API_BASE_URL);
