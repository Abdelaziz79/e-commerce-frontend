// hooks/use-product-mutations.ts
import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/types/auth";
import { CreateProductData, UpdateProductData } from "@/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "./use-product-queries";

// --- PRODUCT MUTATIONS ---

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: CreateProductData) => apiClient.createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Product created successfully!");
      router.push(`/products/${response.data._id}`);
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to create product"),
  });
}

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(variables.productId),
      });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Product updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update product"),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (productId: string) => apiClient.deleteProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.removeQueries({ queryKey: PRODUCT_KEYS.detail(productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      toast.success("Product deleted successfully!");
      router.push("/products");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete product"),
  });
}
