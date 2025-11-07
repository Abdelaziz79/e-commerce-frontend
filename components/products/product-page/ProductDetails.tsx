import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { Star, CheckCircle2, XCircle } from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  brandName: string;
  availableStock: number;
  currentPrice: number;
  originalPrice?: number;
  discountPercent: number;
}

export function ProductDetails({
  product,
  brandName,
  availableStock,
  currentPrice,
  originalPrice,
  discountPercent,
}: ProductDetailsProps) {
  const isInStock = availableStock > 0;

  return (
    <div className="space-y-5">
      {/* Brand & Stock Status */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
          {brandName}
        </span>

        {isInStock ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            In Stock
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-md">
            <XCircle className="w-3.5 h-3.5" />
            Out of Stock
          </span>
        )}
      </div>

      {/* Product Name */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(product.rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-gray-900">
          {product.rating.toFixed(1)}
        </span>
        <span className="text-gray-300">·</span>
        <a
          href="#reviews"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {product.numReviews} {product.numReviews === 1 ? "review" : "reviews"}
        </a>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed">
        {product.description}
      </p>

      {/* Pricing */}
      <div className="flex items-baseline gap-3 pt-1">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">
          ${currentPrice.toFixed(2)}
        </span>
        {originalPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <Badge
              variant="destructive"
              className="text-xs font-semibold px-2 py-0.5 rounded-md"
            >
              -{discountPercent}%
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
