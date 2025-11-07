// src/components/products/product-page/reviews/ReviewList.tsx
import { Review } from "@/types/review";
import { ReviewItem } from "./ReviewItem";

interface ReviewListProps {
  reviews: Review[];
  onImageClick: (imageUrl: string) => void;
}

export function ReviewList({ reviews, onImageClick }: ReviewListProps) {
  return (
    <div className="space-y-0 divide-y divide-gray-100">
      {reviews.map((review) => (
        <ReviewItem
          key={review._id}
          review={review}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}
