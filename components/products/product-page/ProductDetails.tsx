// src/components/products/product-page/ProductDetails.tsx
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { Star } from "lucide-react";

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
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-blue-600 border-blue-200 bg-blue-50"
          >
            {brandName}
          </Badge>
          {availableStock > 0 ? (
            <Badge
              variant="outline"
              className="text-green-600 border-green-200 bg-green-50"
            >
              In Stock ({availableStock})
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          {product.isNewProduct && <Badge>New Arrival</Badge>}
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {product.name}
        </h1>

        <div className="flex items-center mt-3 gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <a href="#reviews" className="text-gray-600 text-sm hover:underline">
            ({product.numReviews}{" "}
            {product.numReviews === 1 ? "review" : "reviews"})
          </a>
        </div>
      </div>

      <p className="text-gray-700 mb-6 text-base leading-relaxed">
        {product.description}
      </p>

      <div className="flex items-baseline mb-6">
        <span className="text-3xl font-bold text-gray-900">
          ${currentPrice.toFixed(2)}
        </span>
        {originalPrice && (
          <span className="ml-3 text-lg text-gray-400 line-through">
            ${originalPrice.toFixed(2)}
          </span>
        )}
        {discountPercent > 0 && (
          <Badge variant="destructive" className="ml-3">
            -{discountPercent}%
          </Badge>
        )}
      </div>
    </>
  );
}
