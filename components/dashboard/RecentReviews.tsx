// components/dashboard/RecentReviews.tsx
"use client";

import { Review } from "@/types/review";
import { ArrowRight, MessageSquare, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getImageSrc } from "@/lib/utils";

interface RecentReviewsProps {
  reviews: Review[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-900">My Reviews</h3>
        </div>
        <div className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
              <MessageSquare className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              No reviews yet
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share your thoughts on products you&apos;ve purchased
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">My Reviews</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/reviews"
            className="text-xs gap-1 hover:gap-2 transition-all"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </div>
      <div className="divide-y divide-slate-100">
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
              className="p-5 hover:bg-slate-50/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Product Image */}
                <Link
                  href={`/products/${productId}`}
                  className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <Image
                    src={getImageSrc(productImage)}
                    alt={productName}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </Link>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${productId}`}
                        className="text-sm font-semibold text-slate-900 hover:text-blue-600 line-clamp-1 block transition-colors"
                      >
                        {productName}
                      </Link>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {review.title && (
                    <p className="text-xs font-semibold text-slate-900 mb-1 line-clamp-1">
                      {review.title}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
