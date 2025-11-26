// hooks/use-product-queries.ts
import { apiClient } from "@/lib/apiClient";
import {
  LowStockListResponse,
  LowStockParams,
  OutOfStockListResponse,
  OutOfStockParams,
  ProductsParams,
  SearchProductsParams,
} from "@/types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys
// Query keys - ADD outOfStock to existing keys
export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params: ProductsParams) => [...PRODUCT_KEYS.lists(), params] as const,
  featured: () => [...PRODUCT_KEYS.all, "featured"] as const,
  sale: () => [...PRODUCT_KEYS.all, "sale"] as const,
  search: () => [...PRODUCT_KEYS.all, "search"] as const,
  searchResults: (params: SearchProductsParams) =>
    [...PRODUCT_KEYS.search(), params] as const,
  stats: () => [...PRODUCT_KEYS.all, "stats"] as const,
  lowStock: () => [...PRODUCT_KEYS.all, "lowStock"] as const,
  lowStockList: (params: LowStockParams) =>
    [...PRODUCT_KEYS.lowStock(), params] as const,
  outOfStock: () => [...PRODUCT_KEYS.all, "outOfStock"] as const, // NEW
  outOfStockList: (
    params: OutOfStockParams // NEW
  ) => [...PRODUCT_KEYS.outOfStock(), params] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PRODUCT_KEYS.details(), id] as const,
} as const;

// --- MAIN QUERIES ---

/**
 * Fetch paginated products with filters
 */
export function useProducts(params: ProductsParams = {}) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => apiClient.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch featured products
 */
export function useFeaturedProducts(limit: number = 5) {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.featured(), limit],
    queryFn: () => apiClient.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch products on sale
 */
export function useOnSaleProducts(limit: number = 10) {
  return useQuery({
    queryKey: [...PRODUCT_KEYS.sale(), limit],
    queryFn: () => apiClient.getOnSaleProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single product by ID or slug
 */
export function useProduct(id: string, enabled: boolean = true) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => apiClient.getProductById(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Search products by query (uses /products/search endpoint)
 */
export function useSearchProducts(
  params: SearchProductsParams,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: PRODUCT_KEYS.searchResults(params),
    queryFn: () => apiClient.searchProducts(params),
    enabled: enabled && !!params.q && params.q.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// --- ADMIN QUERIES ---

/**
 * Fetch product statistics (Admin only)
 */
export function useProductStats(enabled: boolean = true) {
  return useQuery({
    queryKey: PRODUCT_KEYS.stats(),
    queryFn: () => apiClient.getProductStats(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// --- UTILITY HOOKS ---

/**
 * Prefetch a product for smoother navigation
 */
export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.detail(id),
      queryFn: () => apiClient.getProductById(id),
    });
  };
}

/**
 * Prefetch products list for faster page transitions
 */
export function usePrefetchProducts() {
  const queryClient = useQueryClient();
  return (params: ProductsParams = {}) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.list(params),
      queryFn: () => apiClient.getProducts(params),
    });
  };
}

/**
 * Prefetch low stock products
 */
export function usePrefetchLowStockProducts() {
  const queryClient = useQueryClient();
  return (params: LowStockParams = {}) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.lowStockList(params),
      queryFn: () => apiClient.getLowStockProducts(params),
    });
  };
}

/**
 * Fetch low stock products with stock summary (Admin only)
 * Returns products with stockSummary object and lowStockVariations
 */
export function useLowStockProducts(
  params: LowStockParams = {},
  enabled: boolean = true
) {
  return useQuery({
    queryKey: PRODUCT_KEYS.lowStockList(params),
    queryFn: (): Promise<LowStockListResponse> =>
      apiClient.getLowStockProducts(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch out of stock products with stock summary (Admin only)
 * Returns products with stockSummary object and outOfStockVariations
 * NEW HOOK
 */
export function useOutOfStockProducts(
  params: OutOfStockParams = {},
  enabled: boolean = true
) {
  return useQuery({
    queryKey: PRODUCT_KEYS.outOfStockList(params),
    queryFn: (): Promise<OutOfStockListResponse> =>
      apiClient.getOutOfStockProducts(params),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Prefetch out of stock products
 * NEW UTILITY HOOK
 */
export function usePrefetchOutOfStockProducts() {
  const queryClient = useQueryClient();
  return (params: OutOfStockParams = {}) => {
    queryClient.prefetchQuery({
      queryKey: PRODUCT_KEYS.outOfStockList(params),
      queryFn: () => apiClient.getOutOfStockProducts(params),
    });
  };
}
