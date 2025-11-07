"use client";

import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Check, Heart, Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ActionButton } from "./ActionButton";
import { ProductImage } from "./ProductImage";
import { StarRating } from "./StarRating";
import { StockBadge } from "./StockBadge";
import { TruncatedDescription } from "./TruncatedDescription";
import { favoriteButtonVariants, getBorderClasses } from "./productCardUtils";

export interface ProductCardListViewProps {
  product: Product;
  currentImage: string;
  imageError: boolean;
  setImageError: (value: boolean) => void;
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  brandName: string;
  brandSlug: string;
  categoryName: string;
  categorySlug: string;
  displayPrice: number;
  discountPercentage: number;
  isFavorite: boolean;
  isFavoriteLoading: boolean;
  isAddingToCart: boolean;
  showSuccess: boolean;
  token: string | null;
  handleFavoriteClick: (e: React.MouseEvent) => void;
  handleAddToCart: (e: React.MouseEvent) => void;
  position: "left" | "middle" | "right";
  isLast: boolean;
}

export function ProductCardListView({
  product,
  currentImage,
  imageError,
  setImageError,
  isHovered,
  setIsHovered,
  brandName,
  brandSlug,
  categoryName,
  categorySlug,
  displayPrice,
  discountPercentage,
  isFavorite,
  isFavoriteLoading,
  isAddingToCart,
  showSuccess,
  token,
  handleFavoriteClick,
  handleAddToCart,
  position,
  isLast,
}: ProductCardListViewProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <div
        className={cn(
          "group relative w-full overflow-hidden bg-white transition-all duration-200 hover:bg-gray-50/50 flex flex-row items-start gap-6 p-5",
          getBorderClasses("list", position, isLast)
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="w-48 flex-shrink-0">
          <ProductImage
            currentImage={currentImage}
            productName={product.name}
            slug={product.slug}
            imageError={imageError}
            onImageError={() => setImageError(true)}
            discountPercentage={discountPercentage}
            isNewProduct={product.isNewProduct}
            sizes="192px"
            view="list"
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 flex flex-col">
          <Link
            href={`/categories/${categorySlug}`}
            className="text-xs font-medium text-gray-500 mb-2 inline-block hover:text-gray-900 transition-colors"
          >
            {categoryName}
          </Link>

          <h3 className="text-lg font-medium text-gray-900 leading-snug mb-3">
            <Link
              href={`/brands/${brandSlug}`}
              className="font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {brandName}
            </Link>{" "}
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-gray-700 transition-colors"
            >
              {product.name}
            </Link>
          </h3>

          <div className="mb-4">
            <TruncatedDescription text={product.description} lines={2} />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <StarRating
              rating={product.rating}
              reviewCount={product.numReviews}
            />
            <StockBadge stock={product.countInStock} />
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-2 flex-wrap">
                <p className="text-2xl font-semibold text-gray-900">
                  ${displayPrice.toFixed(2)}
                </p>
                {discountPercentage > 0 && (
                  <>
                    <p className="text-base text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </p>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      Save ${(product.price - displayPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <ActionButton
                  tooltip={
                    isFavorite ? "Remove from Wishlist" : "Add to Wishlist"
                  }
                  icon={isFavoriteLoading ? Loader2 : Heart}
                  onClick={handleFavoriteClick}
                  disabled={isFavoriteLoading || !token}
                  className={cn(
                    favoriteButtonVariants({ isFavorite }),
                    "h-10 w-10"
                  )}
                  iconClassName={
                    isFavoriteLoading
                      ? "animate-spin"
                      : isFavorite
                      ? "fill-current"
                      : ""
                  }
                  delay="delay-0"
                />
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    isAddingToCart ||
                    showSuccess ||
                    product.countInStock === 0 ||
                    !token
                  }
                  className={cn(
                    "font-medium transition-all duration-200 shadow-md border border-gray-200 rounded-none",
                    showSuccess
                      ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                      : "bg-white hover:bg-gray-100 text-gray-900"
                  )}
                  size="default"
                >
                  {isAddingToCart ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : showSuccess ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  {showSuccess
                    ? "Added to Cart"
                    : product.countInStock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
