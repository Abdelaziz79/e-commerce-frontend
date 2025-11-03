// hooks/use-category-hooks.ts
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";
import {
  CategoriesParams,
  CategorySearchParams,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Query Keys
export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (params: CategoriesParams, isAdmin: boolean) => [
    ...CATEGORY_KEYS.lists(),
    { ...params, isAdmin },
  ],
  searches: () => [...CATEGORY_KEYS.all, "search"] as const,
  search: (params: CategorySearchParams, isAdmin: boolean) => [
    ...CATEGORY_KEYS.searches(),
    { ...params, isAdmin },
  ],
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useCategories(
  params: CategoriesParams = {},
  options: { isAdmin?: boolean } = {}
) {
  const { isAdmin = false } = options;
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params, isAdmin),
    queryFn: () =>
      isAdmin
        ? apiClient.getAdminCategories(params)
        : apiClient.getCategories(params),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
}

export function useSearchCategories(
  params: CategorySearchParams,
  options: { isAdmin?: boolean; enabled?: boolean } = {}
) {
  const { isAdmin = false, enabled = true } = options;

  return useQuery({
    queryKey: CATEGORY_KEYS.search(params, isAdmin),
    queryFn: () =>
      isAdmin
        ? apiClient.searchAdminCategories(params)
        : apiClient.searchCategories(params),
    enabled: enabled && !!params.q && params.q.trim().length > 0,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => apiClient.getCategoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// --- MUTATIONS ---

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryData) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      toast.success("Category created successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to create category"),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryData;
    }) => apiClient.updateCategory(categoryId, data),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.detail(categoryId),
      });
      toast.success("Category updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update category"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => apiClient.deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      toast.success("Category deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete category"),
  });
}

export function useToggleCategoryActiveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) =>
      apiClient.toggleCategoryActive(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.searches() });
      toast.success("Category status toggled successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to toggle category status"),
  });
}
