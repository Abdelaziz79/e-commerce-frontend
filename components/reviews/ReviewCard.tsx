import { ImageModal } from "@/components/products/product-page/ImageModal";
import { getImageSrc } from "@/lib/utils";
import { Review } from "@/types/review";
import { Calendar, Edit2, Package, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReviewCardProps {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}

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

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const [showFullComment, setShowFullComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isLongComment = review.comment.length > 200;

  const product = typeof review.product === "string" ? null : review.product;

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
        {/* Product Info */}
        <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
            {product?.images?.[0] && (
              <Image
                src={getImageSrc(product.images[0])}
                alt={product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {product ? (
              <Link
                href={`/products/${product.id}`}
                className="font-medium text-gray-900 text-sm mb-1 truncate hover:underline"
              >
                {product.name}
              </Link>
            ) : (
              <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
                Product
              </h3>
            )}
            <p className="text-sm font-semibold text-gray-900">
              ${product?.price?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* Review Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-gray-900 fill-gray-900"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              {review.isVerifiedPurchase && (
                <span className="text-xs text-green-600 font-medium">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{getRelativeTime(review.createdAt)}</span>
              {review.updatedAt !== review.createdAt && (
                <>
                  <span>•</span>
                  <span className="text-gray-400">Edited</span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              title="Edit review"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        {review.title && (
          <h4 className="font-medium text-gray-900 mb-2 text-sm">
            {review.title}
          </h4>
        )}

        {/* Comment */}
        <div className="text-sm text-gray-600 leading-relaxed mb-3">
          {showFullComment || !isLongComment ? (
            review.comment
          ) : (
            <>
              {review.comment.slice(0, 200)}...
              <button
                onClick={() => setShowFullComment(true)}
                className="text-gray-900 font-medium ml-1 hover:underline"
              >
                Read more
              </button>
            </>
          )}
        </div>

        {/* Images */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-3">
            {review.images?.map((image, idx) => {
              const imageUrl = getImageSrc(image);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imageUrl)}
                  className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 cursor-pointer"
                >
                  <Image
                    src={imageUrl}
                    alt={`Review image ${idx + 1} for ${product?.name}`}
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
        <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
          <Package className="w-3.5 h-3.5 mr-1" />
          <span>{review.helpfulVotes} people found this helpful</span>
        </div>
      </div>

      {/* Render the modal */}
      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
}
