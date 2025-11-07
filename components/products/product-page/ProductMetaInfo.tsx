import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { Package, Tag, Box } from "lucide-react";

interface ProductMetaInfoProps {
  product: Product;
}

export function ProductMetaInfo({ product }: ProductMetaInfoProps) {
  const hasInfo =
    (product.tags && product.tags.length > 0) ||
    product.dimensions ||
    product.weight;

  if (!hasInfo) return null;

  return (
    <div className="space-y-4">
      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Tag className="h-3.5 w-3.5" />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-md"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Product Specifications */}
      {(product.dimensions || product.weight) && (
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Box className="h-3.5 w-3.5" />
            <span>Specifications</span>
          </div>

          <div className="space-y-2.5 text-sm">
            {product.dimensions && (
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <span className="text-gray-600 ml-2">
                    {product.dimensions.length} × {product.dimensions.width} ×{" "}
                    {product.dimensions.height} {product.dimensions.unit}
                  </span>
                </div>
              </div>
            )}

            {product.weight && (
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="text-gray-600 ml-2">
                    {product.weight} {product.weightUnit}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
