// src/components/products/product-page/reviews/ProductReviewsSection.tsx
import { Review } from "@/types/review";
import { Star } from "lucide-react";
import { AccordionContent } from "@/components/ui/accordion";
import { SectionContainer } from "../SectionContainer";
import { SectionHeader } from "../SectionHeader";
import { NoReviews } from "./NoReviews";
import { RatingSummary } from "./RatingSummary";
import { ReviewList } from "./ReviewList";

interface ReviewsSectionProps {
  reviews: Review[];
  productId: string;
  onImageClick: (imageUrl: string) => void;
}

export function ProductReviewsSection({
  reviews,
  productId,
  onImageClick,
}: ReviewsSectionProps) {
  return (
    <SectionContainer id="reviews" value="reviews">
      <SectionHeader icon={Star} title={`Reviews (${reviews.length})`} />
      <AccordionContent className="px-5 pb-5 pt-1">
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <RatingSummary reviews={reviews} productId={productId} />
            </div>
            <div className="lg:col-span-3 lg:border-l lg:border-gray-100 lg:pl-6">
              <ReviewList reviews={reviews} onImageClick={onImageClick} />
            </div>
          </div>
        ) : (
          <NoReviews productId={productId} />
        )}
      </AccordionContent>
    </SectionContainer>
  );
}
