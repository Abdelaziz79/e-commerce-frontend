import { ProductVariation } from "@/types/product";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProductVariationsProps {
  variations: ProductVariation[];
  selectedVariationId: string | null;
  onSelectVariation: (id: string) => void;
}

export function ProductVariations({
  variations,
  selectedVariationId,
  onSelectVariation,
}: ProductVariationsProps) {
  if (!variations || variations.length === 0) return null;

  const getVariationLabel = (v: ProductVariation) => {
    const parts = [v.color, v.size, v.style].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : v.sku;
  };

  return (
    <div className="space-y-3.5">
      <h3 className="text-sm font-semibold text-gray-900">Select Options</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {variations.map((v) => {
          const isSelected = selectedVariationId === v._id;
          const isOutOfStock = v.countInStock === 0;

          return (
            <button
              key={v._id}
              onClick={() => !isOutOfStock && onSelectVariation(v._id!)}
              disabled={isOutOfStock}
              className={cn(
                "relative p-3.5 rounded-lg border text-left transition-all",
                isSelected
                  ? "border-gray-900 bg-gray-50"
                  : isOutOfStock
                  ? "border-gray-200 bg-gray-50/50 opacity-50 cursor-not-allowed"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
              )}
            >
              {/* Checkmark for selected */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-4 h-4 bg-gray-900 rounded-full flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Variation label */}
              <div
                className={cn(
                  "font-medium text-sm mb-1.5 pr-6",
                  isSelected ? "text-gray-900" : "text-gray-700"
                )}
              >
                {getVariationLabel(v)}
              </div>

              {/* Price and stock info */}
              <div className="flex items-center justify-between text-xs gap-2">
                <span
                  className={cn(
                    "font-semibold",
                    isSelected ? "text-gray-900" : "text-gray-600"
                  )}
                >
                  ${v.price.toFixed(2)}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    isOutOfStock
                      ? "text-red-600"
                      : v.countInStock < 10
                      ? "text-orange-600"
                      : "text-gray-500"
                  )}
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : v.countInStock < 10
                    ? `${v.countInStock} left`
                    : `${v.countInStock} available`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
