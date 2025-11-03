// hooks/use-product-mutations.ts
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";
import {
  BulkDeleteData,
  BulkUpdateData,
  CreateProductData,
  Product,
  StockAdjustmentData,
  UpdateProductData,
} from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "./use-product-queries";

// --- PRODUCT CRUD MUTATIONS ---

/**
 * Create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: CreateProductData) => apiClient.createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.stats() });
      toast.success("Product created successfully!");
      router.push(`/admin/products/${response.data._id}`);
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to create product"),
  });
}

/**
 * Update an existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductData;
    }) => apiClient.updateProduct(productId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.stats() });
      toast.success("Product updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update product"),
  });
}

/**
 * Delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (productId: string) => apiClient.deleteProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.removeQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.stats() });
      toast.success("Product deleted successfully!");
      router.push("/admin/products");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete product"),
  });
}

// --- BULK OPERATIONS ---

/**
 * Bulk update multiple products
 */
export function useBulkUpdateProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkUpdateData) => apiClient.bulkUpdateProducts(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.stats() });
      toast.success(
        response.message || `${response.data?.modifiedCount} products updated`
      );
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update products"),
  });
}

/**
 * Bulk delete multiple products
 */
export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkDeleteData) => apiClient.bulkDeleteProducts(data),
    onSuccess: (response, variables) => {
      // Remove individual product queries
      variables.productIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: PRODUCT_KEYS.detail(id) });
      });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.stats() });
      toast.success(
        response.message || `${response.data?.deletedCount} products deleted`
      );
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete products"),
  });
}

// --- STOCK MANAGEMENT ---

/**
 * Adjust product stock
 */
export function useAdjustProductStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: StockAdjustmentData;
    }) => apiClient.adjustProductStock(productId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lowStock() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.stats() });
      toast.success(
        `Stock adjusted by ${variables.data.adjustment}${
          variables.data.reason ? `. Reason: ${variables.data.reason}` : ""
        }`
      );
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to adjust stock"),
  });
}

// --- UTILITY HOOKS ---

/**
 * Optimistically update product in cache
 */
export function useOptimisticProductUpdate() {
  const queryClient = useQueryClient();

  return (productId: string, updates: Partial<UpdateProductData>) => {
    queryClient.setQueryData(
      PRODUCT_KEYS.detail(productId),
      (old: { data: Product }) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            ...updates,
          },
        };
      }
    );
  };
}

/**
 * Invalidate all product-related queries
 */
export function useInvalidateProducts() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
  };
}
