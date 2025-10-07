// src/components/products/product-page/ProductVariations.tsx
import { ProductVariation } from "@/types/product";

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

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-800 mb-3">
        Select Variation
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {variations.map((v) => (
          <button
            key={v._id}
            onClick={() => onSelectVariation(v._id!)}
            disabled={v.countInStock === 0}
            className={`p-3 border rounded-lg text-sm transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedVariationId === v._id
                ? "border-black bg-gray-50 ring-2 ring-black"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            <div className="font-medium truncate">
              {[v.color, v.size, v.style].filter(Boolean).join(" - ") || v.sku}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              ${v.price.toFixed(2)} • Stock: {v.countInStock}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
