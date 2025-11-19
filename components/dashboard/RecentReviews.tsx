// components/dashboard/RecentReviews.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review } from "@/types/review";
import { ArrowRight, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageSrc } from "@/lib/utils";

interface RecentReviewsProps {
  reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle className="text-lg font-semibold">My Reviews</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-50 rounded-full mb-4">
              <MessageSquare className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
              Share your thoughts on products you&apos;ve purchased
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/orders">View Orders</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">My Reviews</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/reviews"
              className="text-sm gap-1 hover:gap-2 transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {reviews.map((review) => {
            const productId =
              typeof review.product === "string"
                ? review.product
                : review.product._id;
            const productName =
              typeof review.product === "string"
                ? "Product"
                : review.product.name;
            const productImage =
              typeof review.product === "string"
                ? "/placeholder.png"
                : review.product.images?.[0] || "/placeholder.png";

            return (
              <div
                key={review._id}
                className="p-5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <Link
                    href={`/products/${productId}`}
                    className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-200"
                  >
                    <Image
                      src={getImageSrc(productImage)}
                      alt={productName}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </Link>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${productId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-gray-700 line-clamp-1 block"
                        >
                          {productName}
                        </Link>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-gray-900 fill-gray-900"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    {review.title && (
                      <p className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                        {review.title}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
