// components/users/admin/UserReviewsSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";
import { Star, MessageSquare, ThumbsUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils";

interface UserReviewsSectionProps {
  reviews: Review[];
  totalReviews: number;
}

export function UserReviewsSection({
  reviews,
  totalReviews,
}: UserReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayReviews = showAll ? reviews : reviews.slice(0, 5);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews
          </CardTitle>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">No reviews written</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews
          </CardTitle>
          <Badge variant="secondary" className="font-semibold">
            {totalReviews} total
          </Badge>
        </div>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="pt-6">
        <div className="space-y-4">
          {displayReviews.map((review) => (
            <div
              key={review._id}
              className="p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            >
              {/* Product Link */}
              <Link
                href={`/products/${review.product._id}`}
                className="flex items-start gap-3 mb-3 group"
              >
                <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-border/50">
                  <Image
                    src={getImageSrc(review.product.images[0])}
                    alt={review.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {review.product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Review Title */}
              {review.title && (
                <h5 className="font-semibold text-sm mb-1">{review.title}</h5>
              )}

              {/* Review Comment */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {review.comment}
              </p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {review.images.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-md overflow-hidden border border-border/50"
                    >
                      <Image
                        src={getImageSrc(img)}
                        alt={`Review image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                  {review.images.length > 4 && (
                    <div className="w-16 h-16 rounded-md border border-border/50 flex items-center justify-center bg-muted text-xs font-semibold">
                      +{review.images.length - 4}
                    </div>
                  )}
                </div>
              )}

              {/* Review Badges */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                {review.isVerifiedPurchase && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0 border-green-200 text-green-700 bg-green-50"
                  >
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified Purchase
                  </Badge>
                )}
                {review.helpfulVotes > 0 && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {review.helpfulVotes} helpful
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {reviews.length > 5 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `Show All ${totalReviews} Reviews`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
