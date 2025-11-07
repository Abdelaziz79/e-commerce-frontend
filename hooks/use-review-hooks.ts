// hooks/use-review-hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import {
  CreateReviewData,
  PaginatedReviewsResponse,
  Review,
  ReviewsParams,
  UpdateReviewData,
} from "@/types/review";
import { ApiError } from "@/types/auth";
import { toast } from "sonner";
import { PRODUCT_KEYS } from "./use-product-queries";
import { useAuth } from "./auth-context";

// Query Keys
export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  lists: () => [...REVIEW_KEYS.all, "list"] as const,
  list: (params: ReviewsParams) => [...REVIEW_KEYS.lists(), params] as const,
  details: () => [...REVIEW_KEYS.all, "detail"] as const,
  detail: (id: string) => [...REVIEW_KEYS.details(), id] as const,
  myReviews: (params: ReviewsParams) =>
    [...REVIEW_KEYS.all, "my-reviews", params] as const,
  stats: (productId: string) =>
    [...REVIEW_KEYS.all, "stats", productId] as const,
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

export function useMyReviews(params: ReviewsParams = {}) {
  return useQuery({
    queryKey: REVIEW_KEYS.myReviews(params),
    queryFn: () => apiClient.getMyReviews(params),
  });
}

export function useProductReviewStats(productId: string) {
  return useQuery({
    queryKey: REVIEW_KEYS.stats(productId),
    queryFn: () => apiClient.getProductReviewStats(productId),
    enabled: !!productId,
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
      // Invalidate review stats
      queryClient.invalidateQueries({
        queryKey: REVIEW_KEYS.stats(variables.product),
      });
      // Invalidate the product detail to update rating/numReviews
      queryClient.invalidateQueries({
        queryKey: PRODUCT_KEYS.detail(variables.product),
      });
      // Invalidate my reviews
      queryClient.invalidateQueries({
        queryKey: REVIEW_KEYS.myReviews({}),
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
      const productField = response.data.review.product;
      const productId =
        typeof productField === "string"
          ? productField
          : (productField && (productField._id || productField.id)) || "";

      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });

      if (productId) {
        queryClient.invalidateQueries({
          queryKey: PRODUCT_KEYS.detail(productId),
        });
        queryClient.invalidateQueries({
          queryKey: REVIEW_KEYS.stats(productId),
        });
      } else {
        // fallback: invalidate all products if product id unavailable
        queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      }

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
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      toast.success("Review deleted successfully!");
    },
    onError: (error: ApiError) =>
      toast.error(error.message || "Failed to delete review"),
  });
}

// FIXED: Use real user ID for optimistic updates
export function useVoteReviewHelpful() {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get current user

  return useMutation({
    mutationFn: (reviewId: string) => apiClient.voteReviewHelpful(reviewId),
    onMutate: async (reviewId) => {
      // Don't proceed with optimistic update if no user
      if (!user?._id) return { previousReviews: [] };

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: REVIEW_KEYS.all });

      // Snapshot previous value
      const previousReviews = queryClient.getQueriesData({
        queryKey: REVIEW_KEYS.all,
      });

      // Optimistically update all review queries
      queryClient.setQueriesData(
        { queryKey: REVIEW_KEYS.all },
        (old: PaginatedReviewsResponse | undefined) => {
          if (!old?.data?.reviews) return old;

          return {
            ...old,
            data: {
              ...old.data,
              reviews: old.data.reviews.map((review: Review) =>
                review._id === reviewId
                  ? {
                      ...review,
                      helpfulVotes: review.helpfulVotedBy?.includes(user._id)
                        ? review.helpfulVotes - 1
                        : review.helpfulVotes + 1,
                      helpfulVotedBy: review.helpfulVotedBy?.includes(user._id)
                        ? review.helpfulVotedBy.filter((id) => id !== user._id)
                        : [...(review.helpfulVotedBy || []), user._id],
                    }
                  : review
              ),
            },
          };
        }
      );

      return { previousReviews };
    },
    onError: (error: ApiError, _, context) => {
      // Rollback on error
      if (context?.previousReviews) {
        context.previousReviews.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || "Failed to vote");
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
    },
  });
}
