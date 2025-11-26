// hooks/use-orders.ts
import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/types/auth";
import {
  AddTrackingInfoData,
  AnalyticsParams,
  CancelOrderData,
  CreateOrderData,
  Order,
  OrdersParams,
  SearchOrdersParams,
  UpdateOrderStatusData,
  UpdateToPaidData,
} from "@/types/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import { useUserProfile } from "./use-user-mutations";

// Query keys
export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (params?: OrdersParams) => [...ORDER_KEYS.lists(), params] as const,
  myOrders: (params?: OrdersParams) => ["my-orders", params] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ORDER_KEYS.details(), id] as const,
  userStats: () => ["user-order-stats"] as const,
  analytics: () => [...ORDER_KEYS.all, "analytics"] as const,
  search: (params?: SearchOrdersParams) =>
    [...ORDER_KEYS.all, "search", params] as const,
} as const;

// ============ ORDER QUERIES ============

/**
 * Hook to fetch user's own orders
 */
export function useMyOrders(params: OrdersParams = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.myOrders(params),
    queryFn: () => apiClient.getMyOrders(params),
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const apiError = error as ApiError;
        if (apiError.status === 401 || apiError.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch all orders (Admin only)
 */
export function useOrders(params: OrdersParams = {}) {
  const { token, user } = useAuth();
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => apiClient.getOrders(params),
    enabled: !!token && isAdmin,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const apiError = error as ApiError;
        if (apiError.status === 401 || apiError.status === 403) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(orderId: string) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => apiClient.getOrderById(orderId),
    enabled: !!token && !!orderId,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const apiError = error as ApiError;
        if (
          apiError.status === 401 ||
          apiError.status === 403 ||
          apiError.status === 404
        ) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to fetch user order statistics
 */
export function useUserOrderStats() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.userStats(),
    queryFn: () => apiClient.getUserOrderStats(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch order analytics with date range support (Admin only)
 */
export function useOrderAnalytics(params: AnalyticsParams = {}) {
  const { token } = useAuth();
  const { data } = useUserProfile();
  const user = data?.data;
  const isAdmin = user?.role === "admin";

  return useQuery({
    queryKey: [...ORDER_KEYS.analytics(), params],
    queryFn: () => apiClient.getOrderAnalytics(params),
    enabled: !!token && isAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to search orders
 * - Regular users can search their own orders
 * - Admins can search all orders
 */
export function useSearchOrders(params: SearchOrdersParams) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.search(params),
    queryFn: () => apiClient.searchOrders(params),
    enabled: !!token && !!params.q,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error) {
        const apiError = error as ApiError;
        if (apiError.status === 401 || apiError.status === 403) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to search user's own orders with pagination
 */
export function useSearchMyOrders(params: SearchOrdersParams) {
  const { token } = useAuth();

  return useQuery({
    queryKey: [...ORDER_KEYS.myOrders(), "search", params],
    queryFn: () => apiClient.searchOrders(params),
    enabled: !!token && !!params.q,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============ ORDER MUTATIONS ============

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => apiClient.createOrder(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.myOrders() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.userStats() });
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success(response.message || "Order created successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to create order");
      }
    },
  });
}

/**
 * Hook to update order to paid
 */
export function useUpdateOrderToPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateToPaidData;
    }) => apiClient.updateOrderToPaid(orderId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.myOrders() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.userStats() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });

      toast.success(response.message || "Payment confirmed successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update payment status");
      }
    },
  });
}

/**
 * Hook to update order status (Admin only)
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrderStatusData;
    }) => apiClient.updateOrderStatus(orderId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.analytics() });

      toast.success(response.message || "Order status updated successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update order status");
      }
    },
  });
}

/**
 * Hook to mark order as delivered (Admin only)
 */
export function useUpdateOrderToDelivered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, note }: { orderId: string; note?: string }) =>
      apiClient.updateOrderToDelivered(orderId, note ? { note } : undefined),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.analytics() });

      toast.success(response.message || "Order marked as delivered!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to mark order as delivered");
    },
  });
}

/**
 * Hook to add tracking information (Admin only)
 */
export function useAddTrackingInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: AddTrackingInfoData;
    }) => apiClient.addTrackingInfo(orderId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });

      toast.success(
        response.message || "Tracking information added successfully!"
      );
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to add tracking information");
      }
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: CancelOrderData;
    }) => apiClient.cancelOrder(orderId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ORDER_KEYS.detail(variables.orderId),
      });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.myOrders() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.userStats() });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.analytics() });

      toast.success(response.message || "Order cancelled successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to cancel order");
      }
    },
  });
}

/**
 * Hook to export orders (Admin only)
 */
export function useExportOrders() {
  return useMutation({
    mutationFn: (params: OrdersParams = {}) => apiClient.exportOrders(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Orders exported successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to export orders");
    },
  });
}

// ============ UTILITY HOOKS ============

/**
 * Hook to get order count for user
 */
export function useOrderCount() {
  const { data } = useUserOrderStats();
  return data?.data?.totalOrders || 0;
}

/**
 * Hook to get pending orders count
 */
export function usePendingOrdersCount() {
  const { data } = useMyOrders({ status: "pending" });
  return data?.data?.pagination?.total || 0;
}

/**
 * Hook to check if order can be cancelled
 */
export function canCancelOrder(order?: Order) {
  if (!order) return false;

  const cancellableStatuses = ["pending", "processing"];
  return cancellableStatuses.includes(order.status);
}

/**
 * Hook to get order status color
 */
export function useOrderStatusColor(status: string) {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-50",
    processing: "text-blue-600 bg-blue-50",
    shipped: "text-purple-600 bg-purple-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    refunded: "text-orange-600 bg-orange-50",
    "on-hold": "text-gray-600 bg-gray-50",
    failed: "text-red-700 bg-red-100",
    completed: "text-emerald-600 bg-emerald-50",
  };

  return statusColors[status] || "text-gray-600 bg-gray-50";
}

/**
 * Format order status for display
 */
export function formatOrderStatus(status: string): string {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get status badge variant
 */
export function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    pending: "secondary",
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "destructive",
    "on-hold": "secondary",
    failed: "destructive",
    completed: "default",
  };

  return variants[status] || "outline";
}
