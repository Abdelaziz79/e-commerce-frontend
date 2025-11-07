// src/components/products/product-page/reviews/ReviewItem.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/auth-context";
import { useVoteReviewHelpful } from "@/hooks/use-review-hooks";
import { Review } from "@/types/review";
import { getImageSrc } from "@/lib/utils";
import { CheckCircle2, Loader2, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ReviewItemProps {
  review: Review;
  onImageClick: (imageUrl: string) => void;
}

const getUserInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

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

export function ReviewItem({ review, onImageClick }: ReviewItemProps) {
  const { user } = useAuth();
  const voteHelpfulMutation = useVoteReviewHelpful();

  const handleVoteHelpful = () => {
    if (!user) {
      toast.error("Please log in to vote on reviews");
      return;
    }
    voteHelpfulMutation.mutate(review._id);
  };

  const hasUserVoted = (): boolean => {
    if (!user) return false;
    return review.helpfulVotedBy?.includes(user._id) || false;
  };

  const userHasVoted = hasUserVoted();
  const isVoting =
    voteHelpfulMutation.isPending &&
    voteHelpfulMutation.variables === review._id;

  return (
    <div className="py-5 first:pt-0">
      {/* Header */}
      <div className="flex gap-3 mb-3">
        <Avatar className="w-9 h-9 flex-shrink-0">
          <AvatarImage
            src={getImageSrc(review.user.avatar)}
            alt={review.user.name}
          />
          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
            {getUserInitials(review.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 text-sm">
              {review.user.name}
            </h4>
            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < review.rating
                      ? "text-gray-900 fill-gray-900"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span>·</span>
            <time>{getRelativeTime(review.createdAt)}</time>
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <h5 className="font-medium text-gray-900 mb-2 text-sm">
          {review.title}
        </h5>
      )}

      {/* Comment */}
      <p className="text-gray-600 text-sm leading-relaxed mb-3">
        {review.comment}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3">
          {review.images.map((image, idx) => {
            const imageUrl = getImageSrc(image);
            return (
              <button
                key={idx}
                onClick={() => onImageClick(imageUrl)}
                className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                aria-label={`View review image ${idx + 1}`}
              >
                <Image
                  src={imageUrl}
                  alt={`Review image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleVoteHelpful}
          disabled={isVoting || !user}
          className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            userHasVoted ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
          }`}
          title={
            !user
              ? "Log in to vote"
              : userHasVoted
              ? "You found this helpful"
              : "Mark as helpful"
          }
        >
          {isVoting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ThumbsUp
              className={`w-3.5 h-3.5 ${userHasVoted ? "fill-current" : ""}`}
            />
          )}
          <span>
            Helpful {review.helpfulVotes > 0 && `(${review.helpfulVotes})`}
          </span>
        </button>

        {review.updatedAt !== review.createdAt && (
          <span className="text-xs text-gray-400">Edited</span>
        )}
      </div>
    </div>
  );
}
