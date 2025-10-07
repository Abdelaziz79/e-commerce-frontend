// hooks/use-review-hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  CreateReviewData,
  ReviewsParams,
  UpdateReviewData,
} from "@/types/review";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "./use-product-queries";

// Query Keys
export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  lists: () => [...REVIEW_KEYS.all, "list"] as const,
  list: (params: ReviewsParams) => [...REVIEW_KEYS.lists(), params] as const,
  details: () => [...REVIEW_KEYS.all, "detail"] as const,
  detail: (id: string) => [...REVIEW_KEYS.details(), id] as const,
};

// --- QUERIES ---

export function useReviews(params: ReviewsParams = {}) {
  return useQuery({
    queryKey: REVIEW_KEYS.list(params),
    queryFn: () => apiClient.getReviews(params),
    enabled: !!params.product, // Only fetch if a product ID is provided
  });
}

export function useReview(id: string) {
  return useQuery({
    queryKey: REVIEW_KEYS.detail(id),
    queryFn: () => apiClient.getReviewById(id),
    enabled: !!id,
  });
}

// --- MUTATIONS ---

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewData) => apiClient.createReview(data),
    onSuccess: (_, variables) => {
      // Invalidate reviews for the specific product
      queryClient.invalidateQueries({
        queryKey: REVIEW_KEYS.list({ product: variables.product }),
      });
      // Invalidate the product detail to update rating/numReviews
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(variables.product),
      });
      toast.success("Review submitted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to submit review"),
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      data: UpdateReviewData;
    }) => apiClient.updateReview(reviewId, data),
    onSuccess: (response) => {
      const productId = response.data.review.product;
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(productId),
      });
      toast.success("Review updated successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to update review"),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => apiClient.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      // We don't know which product to invalidate without the review data,
      // so a broader invalidation is acceptable here, or you could manage it optimistically.
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Review deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete review"),
  });
}
