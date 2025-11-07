// src/components/products/product-page/reviews/NoReviews.tsx
import { ReviewDialog } from "@/components/products/ReviewDialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface NoReviewsProps {
  productId: string;
}

export function NoReviews({ productId }: NoReviewsProps) {
  return (
    <div className="text-center py-10">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
        <MessageSquare className="w-5 h-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">
        No reviews yet
      </h3>
      <p className="text-xs text-gray-500 mb-5">
        Be the first to share your thoughts
      </p>
      <ReviewDialog productId={productId}>
        <Button variant="outline" size="sm">
          Write a Review
        </Button>
      </ReviewDialog>
    </div>
  );
}
