// hooks/use-cart-favorites.ts
import { apiClient } from "@/lib/apiClient";
import { ApiError } from "@/types/auth";
import { AddToCartData, UpdateCartItemData } from "@/types/cart";
import { Product, ProductsParams } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./auth-context";

// Query keys (FIXED: Better structure)
export const CART_KEYS = {
  all: ["cart"] as const,
  details: () => [...CART_KEYS.all, "detail"] as const,
  detail: () => [...CART_KEYS.details()] as const,
} as const;

export const FAVORITES_KEYS = {
  all: ["favorites"] as const,
  lists: () => [...FAVORITES_KEYS.all, "list"] as const,
  list: (params?: ProductsParams) =>
    [...FAVORITES_KEYS.lists(), params] as const,
} as const;

export const ORDER_KEYS = {
  all: ["orders"] as const,
  history: () => [...ORDER_KEYS.all, "history"] as const,
  historyList: (params?: ProductsParams) =>
    [...ORDER_KEYS.history(), params] as const,
} as const;

// ============ CART QUERIES ============

/**
 * Hook to fetch user's cart
 */
export function useCart() {
  const { token } = useAuth();

  return useQuery({
    queryKey: CART_KEYS.detail(),
    queryFn: () => apiClient.getCart(),
    enabled: !!token,
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

// ============ CART MUTATIONS ============

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartData) => apiClient.addToCart(data),
    onSuccess: (response) => {
      // Invalidate cart query to refetch
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });

      toast.success(response.message || "Item added to cart successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to add item to cart");
      }
    },
  });
}

/**
 * Hook to update cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateCartItemData;
    }) => apiClient.updateCartItem(productId, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });

      toast.success(response.message || "Cart updated successfully!");
    },
    onError: (error: ApiError) => {
      if (error.validationErrors && error.validationErrors.length > 0) {
        error.validationErrors.forEach((validationError) => {
          toast.error(`${validationError.path}: ${validationError.msg}`);
        });
      } else {
        toast.error(error.message || "Failed to update cart");
      }
    },
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      variationSku,
    }: {
      productId: string;
      variationSku?: string;
    }) => apiClient.removeFromCart(productId, variationSku),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });

      toast.success(response.message || "Item removed from cart!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to remove item from cart");
    },
  });
}

/**
 * Hook to clear entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.clearCart(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.all });

      toast.success(response.message || "Cart cleared successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to clear cart");
    },
  });
}

// ============ FAVORITES QUERIES ============

/**
 * Hook to fetch user's favorites/wishlist
 */
export function useFavorites(params: ProductsParams = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: FAVORITES_KEYS.list(params),
    queryFn: () => apiClient.getFavorites(params),
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

// ============ FAVORITES MUTATIONS ============

/**
 * Hook to add product to favorites
 */
export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => apiClient.addToFavorites(productId),
    onSuccess: (response) => {
      // Invalidate all favorites queries
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEYS.all });

      toast.success(response.message || "Added to favorites!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to add to favorites");
    },
  });
}

/**
 * Hook to remove product from favorites
 */
export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => apiClient.removeFromFavorites(productId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEYS.all });

      toast.success(response.message || "Removed from favorites!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message || "Failed to remove from favorites");
    },
  });
}

/**
 * Hook to toggle favorite status (add/remove)
 */
export function useToggleFavorite() {
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  return {
    toggle: (productId: string, isFavorite: boolean) => {
      if (isFavorite) {
        return removeFromFavorites.mutate(productId);
      } else {
        return addToFavorites.mutate(productId);
      }
    },
    isLoading: addToFavorites.isPending || removeFromFavorites.isPending,
  };
}

// ============ ORDER HISTORY QUERIES ============

/**
 * Hook to fetch user's order history
 */
export function useOrderHistory(params: ProductsParams = {}) {
  const { token } = useAuth();

  return useQuery({
    queryKey: ORDER_KEYS.historyList(params),
    queryFn: () => apiClient.getOrderHistory(params),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
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

// ============ UTILITY HOOKS (FIXED: Better error handling) ============

/**
 * Hook to get cart count
 */
export function useCartCount() {
  const { data, isLoading, error } = useCart();

  if (isLoading || error || !data?.data) {
    return 0;
  }

  return data.data.cartCount || 0;
}

/**
 * Hook to get cart total
 */
export function useCartTotal() {
  const { data, isLoading, error } = useCart();

  if (isLoading || error || !data?.data) {
    return 0;
  }

  return data.data.cartTotal || 0;
}

/**
 * Hook to check if product is in favorites (FIXED: Better error handling)
 */
export function useIsFavorite(productId: string) {
  const { data, isLoading, error } = useFavorites();

  if (isLoading || error || !data?.data?.favorites) {
    return false;
  }

  return data.data.favorites.some((fav: Product) => fav._id === productId);
}
