// hooks/use-product-queries.ts
import { apiClient } from "@/lib/api-client";
import { ProductsParams } from "@/types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params: ProductsParams) => [...PRODUCT_KEYS.lists(), params] as const,
  featured: () => [...PRODUCT_KEYS.all, "featured"] as const,
  sale: () => [...PRODUCT_KEYS.all, "sale"] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
} as const;

// --- QUERIES ---

export function useProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => apiClient.getProducts(params),
  });
}

export function useFeaturedProducts(limit: number = 5) {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.featured(), limit],
    queryFn: () => apiClient.getFeaturedProducts(limit),
  });
}

export function useOnSaleProducts(limit: number = 10) {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.sale(), limit],
    queryFn: () => apiClient.getOnSaleProducts(limit),
  });
}

export function useProduct(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => apiClient.getProductById(id),
    enabled: !!id && enabled,
  });
}

// --- UTILITY HOOKS ---

export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.detail(id),
      queryFn: () => apiClient.getProductById(id),
    });
  };
}
