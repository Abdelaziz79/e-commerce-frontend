// hooks/use-brand-hooks.ts
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";
import {
  BrandsParams,
  BrandSearchParams,
  CreateBrandData,
  UpdateBrandData,
} from "@/types/brand";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const BRAND_KEYS = {
  all: ["brands"] as const,
  lists: () => [...BRAND_KEYS.all, "list"] as const,
  list: (params: BrandsParams, isAdmin: boolean) => [
    ...BRAND_KEYS.lists(),
    { ...params, isAdmin },
  ],
  searches: () => [...BRAND_KEYS.all, "search"] as const,
  search: (params: BrandSearchParams, isAdmin: boolean) => [
    ...BRAND_KEYS.searches(),
    { ...params, isAdmin },
  ],
  details: () => [...BRAND_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BRAND_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useBrands(
  params: BrandsParams = {},
  options: { isAdmin?: boolean } = {}
) {
  const { isAdmin = false } = options;
  return useQuery({
    queryKey: BRAND_KEYS.list(params, isAdmin),
    queryFn: () =>
      isAdmin ? apiClient.getAdminBrands(params) : apiClient.getBrands(params),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

export function useSearchBrands(
  params: BrandSearchParams,
  options: { isAdmin?: boolean; enabled?: boolean } = {}
) {
  const { isAdmin = false, enabled = true } = options;

  return useQuery({
    queryKey: BRAND_KEYS.search(params, isAdmin),
    queryFn: () =>
      isAdmin
        ? apiClient.searchAdminBrands(params)
        : apiClient.searchBrands(params),
    enabled: enabled && !!params.q && params.q.trim().length > 0,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: BRAND_KEYS.detail(id),
    queryFn: () => apiClient.getBrandById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// --- MUTATIONS ---

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandData) => apiClient.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      toast.success("Brand created successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to create brand"),
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      brandId,
      data,
    }: {
      brandId: string;
      data: UpdateBrandData;
    }) => apiClient.updateBrand(brandId, data),
    onSuccess: (_, { brandId }) => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.detail(brandId) });
      toast.success("Brand updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update brand"),
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: string) => apiClient.deleteBrand(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      toast.success("Brand deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete brand"),
  });
}

export function useToggleBrandActiveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: string) => apiClient.toggleBrandActive(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.searches() });
      toast.success("Brand status toggled successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to toggle brand status"),
  });
}
