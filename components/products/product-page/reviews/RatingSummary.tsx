// src/components/products/product-page/reviews/RatingSummary.tsx
import { ReviewDialog } from "@/components/products/ReviewDialog";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";
import { Star } from "lucide-react";

interface RatingSummaryProps {
  reviews: Review[];
  productId: string;
}

export function RatingSummary({ reviews, productId }: RatingSummaryProps) {
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-5">
      {/* Average Rating */}
      <div className="text-center pb-5 border-b border-gray-100">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex justify-center items-center gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(averageRating)
                  ? "text-gray-900 fill-gray-900"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {ratingDistribution.map(({ star, count, percentage }) => (
          <div key={star} className="flex items-center gap-2">
            <div className="flex items-center gap-1 w-8 text-xs text-gray-600">
              <span>{star}</span>
              <Star className="w-3 h-3 text-gray-400 fill-gray-400" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gray-900 h-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-6 text-right">
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* Write Review Button */}
      <ReviewDialog productId={productId}>
        <Button variant="outline" size="sm" className="w-full">
          Write a Review
        </Button>
      </ReviewDialog>
    </div>
  );
}
