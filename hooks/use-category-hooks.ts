// hooks/use-category-hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  CategoriesParams,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";

// Query Keys
export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (params: CategoriesParams) =>
    [...CATEGORY_KEYS.lists(), params] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CATEGORY_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useCategories(params: CategoriesParams = {}) {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: () => apiClient.getCategories(params),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => apiClient.getCategoryById(id),
    enabled: !!id,
  });
}

// --- MUTATIONS ---

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryData) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
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
      toast.success("Category deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete category"),
  });
}
