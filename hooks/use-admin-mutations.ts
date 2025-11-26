// hooks/use-admin-mutations.ts - FIXED VERSION

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient"; // FIXED: Use existing apiClient
import { ApiError } from "@/types/auth";
import {
  BanUserData,
  AdminPaginatedReviewsResponse,
  PaginatedUsersResponse,
  UpdateUserRoleData,
  UserDetailResponse,
  UserOrdersResponse,
  UserReviewsResponse,
  UsersParams,
} from "@/types/admin";
import { ReviewsParams } from "@/types/review";
import { OrdersParams } from "@/types/order";

// ============ QUERY KEYS ============

export const ADMIN_KEYS = {
  users: (params?: UsersParams) => ["admin", "users", params] as const,
  user: (id: string) => ["admin", "user", id] as const,
  userReviews: (id: string, params?: ReviewsParams) =>
    ["admin", "user", id, "reviews", params] as const,
  userOrders: (id: string, params?: OrdersParams) =>
    ["admin", "user", id, "orders", params] as const,
  reviews: (params?: ReviewsParams) => ["admin", "reviews", params] as const,
} as const;

// ============ QUERIES ============

/**
 * Hook to fetch all users with filters
 */
export function useAdminUsers(params: UsersParams = {}) {
  return useQuery<PaginatedUsersResponse, ApiError>({
    queryKey: ADMIN_KEYS.users(params),
    queryFn: () => apiClient.getAllUsers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch user details by ID - FIXED
 */
export function useAdminUser(userId: string) {
  return useQuery<UserDetailResponse, ApiError>({
    queryKey: ADMIN_KEYS.user(userId),
    queryFn: () => apiClient.getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch user's reviews
 */
export function useUserReviews(userId: string, params: ReviewsParams = {}) {
  return useQuery<UserReviewsResponse, ApiError>({
    queryKey: ADMIN_KEYS.userReviews(userId, params),
    queryFn: () => apiClient.getUserReviews(userId, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch user's orders
 */
export function useUserOrders(userId: string, params: OrdersParams = {}) {
  return useQuery<UserOrdersResponse, ApiError>({
    queryKey: ADMIN_KEYS.userOrders(userId, params),
    queryFn: () => apiClient.getUserOrders(userId, params),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch all reviews (admin endpoint)
 */
export function useAdminReviews(params: ReviewsParams = {}) {
  return useQuery<AdminPaginatedReviewsResponse, ApiError>({
    queryKey: ADMIN_KEYS.reviews(params),
    queryFn: () => apiClient.getAllReviews(params),
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
}

// ============ MUTATIONS ============

/**
 * Hook to ban user
 */
export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: BanUserData }) =>
      apiClient.banUser(userId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "User banned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.user(variables.userId),
      });
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to ban user");
      }
    },
  });
}

/**
 * Hook to suspend user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: BanUserData }) =>
      apiClient.suspendUser(userId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "User suspended successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.user(variables.userId),
      });
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to suspend user");
      }
    },
  });
}

/**
 * Hook to unban/unsuspend user
 */
export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiClient.unbanUser(userId),
    onSuccess: (response, userId) => {
      toast.success(response.message || "User unbanned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.user(userId) });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to unban user");
    },
  });
}

/**
 * Hook to update user role
 */
export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserRoleData;
    }) => apiClient.updateUserRole(userId, data),
    onSuccess: (response, variables) => {
      toast.success(response.message || "User role updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ADMIN_KEYS.user(variables.userId),
      });
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update user role");
      }
    },
  });
}

/**
 * Hook to delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => apiClient.deleteUser(userId),
    onSuccess: (response) => {
      toast.success(response.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete user");
    },
  });
}

/**
 * Hook to delete review by admin
 */
export function useDeleteReviewByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => apiClient.deleteReviewByAdmin(reviewId),
    onSuccess: (response) => {
      toast.success(response.message || "Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to delete review");
    },
  });
}
