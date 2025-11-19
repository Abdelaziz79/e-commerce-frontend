"use client";

import { PaginationControls } from "@/components/PaginationControls";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DeleteReviewDialog } from "@/components/reviews/DeleteReviewDialog";
import { EditReviewDialog } from "@/components/reviews/EditReviewDialog";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { useMyReviews } from "@/hooks/use-review-hooks";
import { Review } from "@/types/review";
import { Loader2, Package, Star } from "lucide-react";
import { useState } from "react";

export default function MyReviewsPage() {
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Build query params based on filter
  const queryParams: {
    page?: number;
    limit?: number;
    rating?: string;
    verified?: string;
  } = { page, limit };

  if (filter === "verified") {
    queryParams.verified = "true";
  } else if (filter !== "all") {
    queryParams.rating = filter;
  }

  const { data, isLoading, error } = useMyReviews(queryParams);

  const reviews = data?.data?.reviews || [];
  const totalReviews = data?.total || 0;
  const totalPages = Math.ceil(totalReviews / limit);

  // Use stats from backend
  const stats = data?.stats || {
    totalReviews: 0,
    avgRating: 0,
    totalHelpfulVotes: 0,
    verifiedCount: 0,
    ratingBreakdown: {},
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset to page 1 when filter changes
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load reviews</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              My Reviews
            </h1>
            <p className="text-gray-600">Manage all your product reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {stats.avgRating.toFixed(1)}
                </span>
                <Star className="w-5 h-5 text-gray-900 fill-gray-900" />
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.totalHelpfulVotes}
              </div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Reviews ({stats.totalReviews})
              </button>
              <button
                onClick={() => handleFilterChange("verified")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === "verified"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Verified Only ({stats.verifiedCount})
              </button>
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingBreakdown[rating] || 0;
                return (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange(rating.toString())}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1 ${
                      filter === rating.toString()
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {rating} <Star className="w-3 h-3 fill-current" /> ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {reviews.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onEdit={() => setEditingReview(review)}
                    onDelete={() => setDeletingReview(review)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <PaginationControls
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalResults={totalReviews}
                  resultsPerPage={limit}
                />
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-sm text-gray-600">
                {filter === "all"
                  ? "You haven't written any reviews yet"
                  : "No reviews match the selected filter"}
              </p>
            </div>
          )}
        </div>

        {editingReview && (
          <EditReviewDialog
            review={editingReview}
            isOpen={!!editingReview}
            onClose={() => setEditingReview(null)}
          />
        )}

        {deletingReview && (
          <DeleteReviewDialog
            review={deletingReview}
            isOpen={!!deletingReview}
            onClose={() => setDeletingReview(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
