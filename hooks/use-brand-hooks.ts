// hooks/use-brand-hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { BrandsParams, CreateBrandData, UpdateBrandData } from "@/types/brand";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";

// Query Keys
export const BRAND_KEYS = {
  all: ["brands"] as const,
  lists: () => [...BRAND_KEYS.all, "list"] as const,
  list: (params: BrandsParams) => [...BRAND_KEYS.lists(), params] as const,
  details: () => [...BRAND_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BRAND_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useBrands(params: BrandsParams = {}) {
  return useQuery({
    queryKey: BRAND_KEYS.list(params),
    queryFn: () => apiClient.getBrands(params),
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: BRAND_KEYS.detail(id),
    queryFn: () => apiClient.getBrandById(id),
    enabled: !!id,
  });
}

// --- MUTATIONS ---

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBrandData) => apiClient.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRAND_KEYS.lists() });
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
      toast.success("Brand deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete brand"),
  });
}
