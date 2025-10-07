// lib/api-client.ts

// --- CORE & AUTH IMPORTS ---
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
  CreateProductData,
  PaginatedProductsResponse,
  ProductListResponse,
  ProductResponse,
  ProductsParams,
  UpdateProductData,
} from "@/types/product";

// --- NEW IMPORTS FOR REFACTORED MODELS ---
import {
  BrandResponse,
  BrandsParams,
  CreateBrandData,
  PaginatedBrandsResponse,
  UpdateBrandData,
} from "@/types/brand";
import {
  CategoriesParams,
  CategoryResponse,
  CreateCategoryData,
  PaginatedCategoriesResponse,
  UpdateCategoryData,
} from "@/types/category";
import {
  CreateReviewData,
  PaginatedReviewsResponse,
  ReviewResponse,
  ReviewsParams,
  UpdateReviewData,
} from "@/types/review";

// --- CART & FAVORITES TYPES (Add these to your types/user.ts) ---

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Core request method to handle all API calls.
   */
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

      // Handle 204 No Content response
      if (response.status === 204) {
        return {} as T;
      }

      const data: unknown = await response.json();

      if (!response.ok) {
        if (response.status === 400 && isValidationErrorResponse(data)) {
          const errorMessages = data.errors.map(
            (error: ValidationError) => error.msg
          );
          const errorMessage = errorMessages.join(". ");
          const validationError = new Error(errorMessage) as ApiError;
          validationError.status = response.status;
          validationError.validationErrors = data.errors;
          throw validationError;
        }

        if (isApiErrorResponse(data)) {
          const apiError = new Error(data.message) as ApiError;
          apiError.status = response.status;
          throw apiError;
        }

        const fallbackError = new Error(
          "An unexpected error occurred"
        ) as ApiError;
        fallbackError.status = response.status;
        throw fallbackError;
      }

      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("A network error occurred.");
    }
  }

  private createQueryString(params: Record<string, unknown>): string {
    const cleanParams: Record<string, string> = {};
    for (const key in params) {
      const value = params[key];
      // Only include the parameter if it's not null or undefined
      if (value !== null && value !== undefined) {
        cleanParams[key] = String(value);
      }
    }
    return new URLSearchParams(cleanParams).toString();
  }

  // --- Auth endpoints ---
  login = (credentials: LoginCredentials) =>
    this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

  register = (userData: RegisterData) =>
    this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

  forgotPassword = (data: ForgotPasswordData): Promise<{ message: string }> =>
    this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

  resetPassword = (token: string, data: ResetPasswordData) =>
    this.request<AuthResponse>(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify(data),
    });

  verifyEmail = (token: string) =>
    this.request(`/auth/verify-email/${token}`, { method: "GET" });

  // --- User profile endpoints ---
  getUserProfile = () => this.request<UserProfileResponse>("/users/profile");

  updateUserProfile = (data: UpdateProfileData) =>
    this.request<UserUpdateResponse>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });

  updateUserPassword = (data: UpdatePasswordData) =>
    this.request<PasswordUpdateResponse>("/users/update-password", {
      method: "PUT",
      body: JSON.stringify(data),
    });

  // --- Address endpoints ---
  addUserAddress = (data: AddAddressData) =>
    this.request<AddressResponse>("/users/address", {
      method: "POST",
      body: JSON.stringify(data),
    });

  updateUserAddress = (addressId: string, data: UpdateAddressData) =>
    this.request<AddressResponse>(`/users/address/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  deleteUserAddress = (addressId: string) =>
    this.request<AddressResponse>(`/users/address/${addressId}`, {
      method: "DELETE",
    });

  // --- Cart endpoints (NEW) ---
  getCart = () => this.request<CartResponse>("/users/cart");

  addToCart = (data: AddToCartData) =>
    this.request<CartResponse>("/users/cart", {
      method: "POST",
      body: JSON.stringify(data),
    });

  updateCartItem = (productId: string, data: UpdateCartItemData) =>
    this.request<CartResponse>(`/users/cart/${productId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  removeFromCart = (productId: string, variationSku?: string) => {
    const queryString = variationSku ? `?variationSku=${variationSku}` : "";
    return this.request<CartResponse>(
      `/users/cart/${productId}${queryString}`,
      {
        method: "DELETE",
      }
    );
  };

  clearCart = () =>
    this.request<CartResponse>("/users/cart", {
      method: "DELETE",
    });

  // --- Favorites endpoints (NEW) ---
  getFavorites = (params: ProductsParams = {}) => {
    // APPLY THE FIX HERE
    const queryString = this.createQueryString(params);
    return this.request<FavoritesResponse>(`/users/favorites?${queryString}`);
  };

  addToFavorites = (productId: string) =>
    this.request<AddToFavoritesResponse>("/users/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });

  removeFromFavorites = (productId: string) =>
    this.request<RemoveFromFavoritesResponse>(`/users/favorites/${productId}`, {
      method: "DELETE",
    });

  // --- Order history endpoint (NEW) ---
  getOrderHistory = (params: ProductsParams = {}) => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<OrderHistoryResponse>(`/users/orders?${queryString}`);
  };

  // --- Product endpoints ---
  async getProducts(
    params: ProductsParams = {}
  ): Promise<PaginatedProductsResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<PaginatedProductsResponse>(`/products?${queryString}`);
  }

  getFeaturedProducts = (limit = 5) =>
    this.request<ProductListResponse>(`/products/featured?limit=${limit}`);

  getOnSaleProducts = (limit = 10) =>
    this.request<ProductListResponse>(`/products/sale?limit=${limit}`);

  getProductById = (id: string) =>
    this.request<ProductResponse>(`/products/${id}`);

  createProduct = (data: CreateProductData) =>
    this.request<ProductResponse>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });

  updateProduct = (productId: string, data: UpdateProductData) =>
    this.request<ProductResponse>(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  deleteProduct = (productId: string) =>
    this.request<{ status: string; message: string }>(
      `/products/${productId}`,
      { method: "DELETE" }
    );

  // --- Category endpoints ---
  async getCategories(
    params: CategoriesParams = {}
  ): Promise<PaginatedCategoriesResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<PaginatedCategoriesResponse>(
      `/categories?${queryString}`
    );
  }

  getCategoryById = (id: string) =>
    this.request<CategoryResponse>(`/categories/${id}`);

  createCategory = (data: CreateCategoryData) =>
    this.request<CategoryResponse>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });

  updateCategory = (categoryId: string, data: UpdateCategoryData) =>
    this.request<CategoryResponse>(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  deleteCategory = (categoryId: string) =>
    this.request<void>(`/categories/${categoryId}`, { method: "DELETE" });

  // --- Brand endpoints ---
  async getBrands(params: BrandsParams = {}): Promise<PaginatedBrandsResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<PaginatedBrandsResponse>(`/brands?${queryString}`);
  }

  getBrandById = (id: string) => this.request<BrandResponse>(`/brands/${id}`);

  createBrand = (data: CreateBrandData) =>
    this.request<BrandResponse>("/brands", {
      method: "POST",
      body: JSON.stringify(data),
    });

  updateBrand = (brandId: string, data: UpdateBrandData) =>
    this.request<BrandResponse>(`/brands/${brandId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  deleteBrand = (brandId: string) =>
    this.request<void>(`/brands/${brandId}`, { method: "DELETE" });

  // --- Review endpoints ---
  async getReviews(
    params: ReviewsParams = {}
  ): Promise<PaginatedReviewsResponse> {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return this.request<PaginatedReviewsResponse>(`/reviews?${queryString}`);
  }

  getReviewById = (id: string) =>
    this.request<ReviewResponse>(`/reviews/${id}`);

  createReview = (data: CreateReviewData) =>
    this.request<ReviewResponse>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    });

  updateReview = (reviewId: string, data: UpdateReviewData) =>
    this.request<ReviewResponse>(`/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  deleteReview = (reviewId: string) =>
    this.request<void>(`/reviews/${reviewId}`, { method: "DELETE" });

  // --- Order endpoints ---

  /**
   * Create a new order
   */
  createOrder = (data: CreateOrderData) =>
    this.request<OrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });

  /**
   * Get user's own orders
   */
  getMyOrders = (params: OrdersParams = {}) => {
    // APPLY THE FIX HERE
    const queryString = this.createQueryString(params);
    return this.request<PaginatedOrdersResponse>(
      `/orders/myorders?${queryString}`
    );
  };

  /**
   * Get user order statistics
   */
  getUserOrderStats = () =>
    this.request<OrderStatsResponse>("/orders/user-stats");

  /**
   * Get all orders (Admin only)
   */
  getOrders = (params: OrdersParams = {}) => {
    // APPLY THE FIX HERE
    const queryString = this.createQueryString(params);
    return this.request<PaginatedOrdersResponse>(`/orders?${queryString}`);
  };

  /**
   * Search orders (Admin only)
   */
  searchOrders = (params: SearchOrdersParams) => {
    // APPLY THE FIX HERE
    const queryString = this.createQueryString(params);
    return this.request<PaginatedOrdersResponse>(
      `/orders/search?${queryString}`
    );
  };

  /**
   * Get order analytics (Admin only)
   */
  getOrderAnalytics = () =>
    this.request<OrderAnalyticsResponse>("/orders/analytics");

  /**
   * Export orders to CSV (Admin only)
   */
  exportOrders = async (params: OrdersParams = {}): Promise<Blob> => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const url = `${this.baseURL}/orders/export?${queryString}`;
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const data = await response.json();
      const error = new Error(
        data.message || "Failed to export orders"
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    return response.blob();
  };

  /**
   * Get single order by ID
   */
  getOrderById = (orderId: string) =>
    this.request<OrderResponse>(`/orders/${orderId}`);

  /**
   * Update order to paid
   */
  updateOrderToPaid = (orderId: string, data: UpdateToPaidData) =>
    this.request<OrderResponse>(`/orders/${orderId}/pay`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  /**
   * Update order status (Admin only)
   */
  updateOrderStatus = (orderId: string, data: UpdateOrderStatusData) =>
    this.request<OrderResponse>(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  /**
   * Mark order as delivered (Admin only)
   */
  updateOrderToDelivered = (orderId: string) =>
    this.request<OrderResponse>(`/orders/${orderId}/deliver`, {
      method: "PUT",
    });

  /**
   * Add tracking information (Admin only)
   */
  addTrackingInfo = (orderId: string, data: AddTrackingInfoData) =>
    this.request<OrderResponse>(`/orders/${orderId}/tracking`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

  /**
   * Cancel order
   */
  cancelOrder = (orderId: string, data: CancelOrderData) =>
    this.request<OrderResponse>(`/orders/${orderId}/cancel`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
}

export const apiClient = new ApiClient(API_BASE_URL);
