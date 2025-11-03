// src/components/products/product-page/ProductInfoTabs.tsx
"use client";

import { ReviewDialog } from "@/components/products/ReviewDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/auth-context";
import { useVoteReviewHelpful } from "@/hooks/use-review-hooks";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import {
  CheckCircle2,
  Loader2,
  RotateCw,
  ShieldCheck,
  Star,
  ThumbsUp,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";

interface ProductInfoTabsProps {
  product: Product;
  reviews: Review[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IMAGES || "http://localhost:5000";

export function ProductInfoTabs({ product, reviews }: ProductInfoTabsProps) {
  const { user } = useAuth();
  const voteHelpfulMutation = useVoteReviewHelpful();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Calculate rating statistics
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  const handleVoteHelpful = (reviewId: string) => {
    if (!user) {
      toast.error("Please log in to vote on reviews");
      return;
    }
    voteHelpfulMutation.mutate(reviewId);
  };

  // Check if current user has voted on a review
  const hasUserVoted = (review: Review): boolean => {
    if (!user) return false;
    return review.helpfulVotedBy?.includes(user._id) || false;
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format relative time
  const getRelativeTime = (date: string): string => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInDays = Math.floor(
      (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <>
      <Tabs defaultValue="description" className="w-full" id="reviews">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger
            value="specifications"
            disabled={
              !product.attributes ||
              Object.keys(product.attributes).length === 0
            }
          >
            Specifications
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description">
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose max-w-none prose-p:text-gray-700 prose-headings:text-gray-900"
                dangerouslySetInnerHTML={{
                  __html:
                    product.richDescription || `<p>${product.description}</p>`,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Specifications Tab */}
        <TabsContent value="specifications">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.attributes &&
                  Object.entries(product.attributes).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex border-b border-gray-100 pb-3"
                    >
                      <span className="font-medium text-gray-800 w-1/3 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab - Enhanced with All Data */}
        <TabsContent value="reviews">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rating Summary Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Customer Ratings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Average Rating */}
                <div className="text-center pb-6 border-b">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(averageRating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Based on {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-3">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16 text-sm">
                        <span className="text-gray-700">{star}</span>
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Write Review Button */}
                <div className="pt-4">
                  <ReviewDialog productId={product._id}>
                    <Button className="w-full">Write a Review</Button>
                  </ReviewDialog>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  Real experiences from verified buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => {
                      const userHasVoted = hasUserVoted(review);
                      const isVoting =
                        voteHelpfulMutation.isPending &&
                        voteHelpfulMutation.variables === review._id;

                      const avatarUrl = review.user.avatar?.startsWith("http")
                        ? review.user.avatar
                        : `${API_BASE_URL}${review.user.avatar}`;

                      return (
                        <div
                          key={review._id}
                          className="pb-6 border-b border-gray-100 last:border-0"
                        >
                          {/* Review Header with Avatar */}
                          <div className="flex items-start gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={avatarUrl}
                                alt={review.user.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getUserInitials(review.user.name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-gray-900">
                                  {review.user.name}
                                </span>
                                {review.isVerifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {getRelativeTime(review.createdAt)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Review Title */}
                          {review.title && (
                            <h4 className="font-semibold text-gray-900 mb-2 text-base">
                              {review.title}
                            </h4>
                          )}

                          {/* Review Comment */}
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.comment}
                          </p>

                          {/* Review Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-4 flex-wrap">
                              {review.images.map((image, idx) => {
                                const imageUrl = image.startsWith("http")
                                  ? image
                                  : `${API_BASE_URL}${image}`;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedImage(imageUrl)}
                                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-all hover:shadow-md cursor-pointer group"
                                  >
                                    <Image
                                      src={imageUrl}
                                      alt={`Review image ${idx + 1}`}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-200"
                                      sizes="80px"
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Review Actions - Voting Button */}
                          <div className="flex items-center gap-4 text-sm pt-2">
                            <button
                              onClick={() => handleVoteHelpful(review._id)}
                              disabled={isVoting || !user}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                userHasVoted
                                  ? "bg-blue-50 text-blue-600 font-medium border border-blue-200"
                                  : "text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                              }`}
                              title={
                                !user
                                  ? "Log in to vote"
                                  : userHasVoted
                                  ? "Remove your vote"
                                  : "Mark as helpful"
                              }
                            >
                              {isVoting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <ThumbsUp
                                  className={`w-4 h-4 ${
                                    userHasVoted ? "fill-current" : ""
                                  }`}
                                />
                              )}
                              <span>Helpful ({review.helpfulVotes})</span>
                            </button>

                            {/* Show last updated if different from created */}
                            {review.updatedAt !== review.createdAt && (
                              <span className="text-xs text-gray-400 ml-auto">
                                Edited {getRelativeTime(review.updatedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      Be the first to share your thoughts about this product and
                      help other customers make informed decisions.
                    </p>
                    <ReviewDialog productId={product._id}>
                      <Button>Write the First Review</Button>
                    </ReviewDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shipping & Returns Tab */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <Truck className="mr-2 h-5 w-5 text-gray-600" /> Shipping
                  Policy
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>
                    We are committed to delivering your products in a timely and
                    efficient manner.
                  </p>
                  <ul>
                    <li>
                      <strong>Standard Shipping:</strong> Free for orders over
                      $50. For orders under $50, a flat rate of $4.99 applies.
                      Delivery typically takes 3-5 business days.
                    </li>
                    <li>
                      <strong>Express Shipping:</strong> Available for a flat
                      rate of $12.99. Delivery typically takes 1-2 business
                      days.
                    </li>
                    <li>
                      <strong>Processing Time:</strong> Most orders are
                      processed and shipped within 24-48 hours of placement.
                    </li>
                  </ul>
                  <p>
                    You will receive a shipping confirmation email with a
                    tracking number as soon as your order is dispatched.
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center">
                  <RotateCw className="mr-2 h-5 w-5 text-gray-600" /> Return
                  Policy
                </h3>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>
                    Your satisfaction is our priority. If you&apos;re not
                    completely happy with your purchase, you can return it
                    within <strong>30 days</strong> of delivery.
                  </p>
                  <ul>
                    <li>
                      Items must be in new, unused condition with all original
                      packaging and tags attached.
                    </li>
                    <li>
                      To initiate a return, please visit our online returns
                      center or contact customer support.
                    </li>
                    <li>
                      Refunds will be processed to the original payment method
                      within 5-7 business days after we receive and inspect the
                      returned item.
                    </li>
                  </ul>
                </div>
              </div>
              {product.warranty && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center">
                      <ShieldCheck className="mr-2 h-5 w-5 text-gray-600" />{" "}
                      Warranty
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {product.warranty}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Review image"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
