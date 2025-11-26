// types/admin.ts - FIXED VERSION

import { CartItem } from "./cart";
import { Order } from "./order";
import { Product } from "./product";
import { Review } from "./review";
import { Address } from "./user";

// ============ USER TYPES ============

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "banned" | "suspended";
  avatar: string;
  isEmailVerified: boolean;
  phone?: string;
  banReason?: string;
  bannedAt?: string;
  bannedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// FIXED: Proper favorite structure
export interface AdminFavoriteItem {
  product: string | Product; // Can be ID or populated product
  addedAt: string;
  _id?: string;
}

// FIXED: Complete user profile for admin
export interface AdminUserProfile extends AdminUser {
  cart: CartItem[];
  favorites: AdminFavoriteItem[]; // CHANGED from FavoriteProduct[]
  addresses: Address[];
  orderHistory: Array<{
    order: string;
    totalPrice: number;
    status: string;
    createdAt: string;
  }>;
}

export interface UserStatistics {
  orderCount: number;
  reviewCount: number;
  totalSpent: number;
  avgOrderValue: number;
  cartItems: number;
  favoriteItems: number;
  addressesCount: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  suspendedUsers: number;
  adminUsers: number;
}

// ============ REQUEST PARAMS ============

export interface UsersParams {
  page?: number;
  limit?: number;
  sort?: string;
  status?: "active" | "banned" | "suspended";
  role?: "user" | "admin";
  keyword?: string;
  [key: string]: string | number | undefined;
}

export interface BanUserData {
  reason?: string;
}

export interface UpdateUserRoleData {
  role: "user" | "admin";
}

export type { ReviewsParams } from "./review";

// ============ API RESPONSES ============

export interface PaginatedUsersResponse {
  status: string;
  results: number;
  page: number;
  pages: number;
  total: number;
  stats: UserStats;
  data: AdminUser[];
}

export interface UserDetailResponse {
  status: string;
  data: {
    user: AdminUserProfile; // CHANGED to include full profile
    statistics: UserStatistics;
  };
}

export interface UserActionResponse {
  status: string;
  message: string;
  data?: {
    user: {
      _id: string;
      name: string;
      email: string;
      status: string;
      role?: string;
      banReason?: string;
      bannedAt?: string;
    };
  };
}

export interface AdminPaginatedReviewsResponse {
  status: string;
  results: number;
  page: number;
  pages: number;
  total: number;
  stats: {
    totalReviews: number;
    avgRating: number;
    totalHelpfulVotes: number;
    verifiedPurchases: number;
  };
  data: Review[];
}

export interface UserReviewsResponse {
  status: string;
  results: number;
  page: number;
  pages: number;
  total: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  data: Review[];
}

export interface UserOrdersResponse {
  status: string;
  results: number;
  page: number;
  pages: number;
  total: number;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  data: Order[];
}
