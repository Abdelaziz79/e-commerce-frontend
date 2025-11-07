"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Check, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { StarRating } from "./StarRating";
import { StockBadge } from "./StockBadge";
import { TruncatedDescription } from "./TruncatedDescription";
import { ActionButton } from "./ActionButton";
import { ProductImage } from "./ProductImage";
import { favoriteButtonVariants, getBorderClasses } from "./productCardUtils";

interface ProductCardGridViewProps {
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

export function ProductCardGridView({
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
}: ProductCardGridViewProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Card
        className={cn(
          "group relative w-full overflow-hidden transition-all duration-200 hover:bg-gray-50/50 flex flex-col h-full border-0 shadow-none rounded-none p-0",
          getBorderClasses("grid", position, isLast)
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          <ProductImage
            currentImage={currentImage}
            productName={product.name}
            slug={product.slug}
            imageError={imageError}
            onImageError={() => setImageError(true)}
            discountPercentage={discountPercentage}
            isNewProduct={product.isNewProduct}
            featured={product.featured}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            view="grid"
          />

          {/* Action Buttons - Only visible on THIS card's hover */}
          {isHovered && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <div
                className={cn(
                  "transform transition-all duration-300 ease-out",
                  "animate-in fade-in slide-in-from-right-4"
                )}
                style={{
                  animationDelay: "50ms",
                  animationFillMode: "backwards",
                }}
              >
                <ActionButton
                  tooltip="Quick View"
                  icon={Eye}
                  href={`/products/${product.slug}`}
                  delay="delay-0"
                  className="h-9 w-9"
                />
              </div>
              <div
                className={cn(
                  "transform transition-all duration-300 ease-out",
                  "animate-in fade-in slide-in-from-right-4"
                )}
                style={{
                  animationDelay: "100ms",
                  animationFillMode: "backwards",
                }}
              >
                <ActionButton
                  tooltip={
                    isFavorite ? "Remove from Wishlist" : "Add to Wishlist"
                  }
                  icon={isFavoriteLoading ? Loader2 : Heart}
                  onClick={handleFavoriteClick}
                  disabled={isFavoriteLoading || !token}
                  className={cn(
                    favoriteButtonVariants({ isFavorite }),
                    "h-9 w-9"
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
              </div>
            </div>
          )}

          {/* Quick Add to Cart Button */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-3",
              "transform transition-all duration-300 ease-out",
              isHovered && product.countInStock > 0
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            )}
          >
            <Button
              onClick={handleAddToCart}
              disabled={
                isAddingToCart ||
                showSuccess ||
                product.countInStock === 0 ||
                !token
              }
              className={cn(
                "w-full font-medium transition-all duration-200 text-sm shadow-md border border-gray-200 rounded-none",
                showSuccess
                  ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                  : "bg-white text-gray-900 hover:bg-gray-100"
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

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category & Stock */}
          <div className="flex items-center justify-between mb-2">
            <Link
              href={`/categories/${categorySlug}`}
              className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {categoryName}
            </Link>
            <StockBadge stock={product.countInStock} />
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2">
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

          {/* Description */}
          <div className="mb-3 flex-grow hidden sm:block">
            <TruncatedDescription text={product.description} />
          </div>

          {/* Rating */}
          <div className="mb-3">
            <StarRating
              rating={product.rating}
              reviewCount={product.numReviews}
            />
          </div>

          {/* Price Section */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-xl font-semibold text-gray-900">
                ${displayPrice.toFixed(2)}
              </p>
              {discountPercentage > 0 && (
                <>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </p>
                  <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    Save ${(product.price - displayPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
}
