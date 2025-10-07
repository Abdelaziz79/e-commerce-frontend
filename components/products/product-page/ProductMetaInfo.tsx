// src/components/products/product-page/ProductMetaInfo.tsx
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { Package, Tag } from "lucide-react";

interface ProductMetaInfoProps {
  product: Product;
}

export function ProductMetaInfo({ product }: ProductMetaInfoProps) {
  return (
    <div className="space-y-4">
      {product.tags && product.tags.length > 0 && (
        <div className="flex items-center text-sm text-gray-600">
          <Tag className="h-4 w-4 mr-2" />
          <span className="font-medium text-gray-800 mr-2">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
      {product.dimensions && (
        <div className="flex items-center text-sm text-gray-600">
          <Package className="h-4 w-4 mr-2" />
          <span className="font-medium text-gray-800 mr-2">Dimensions:</span>
          <span>
            {product.dimensions.length} x {product.dimensions.width} x{" "}
            {product.dimensions.height} {product.dimensions.unit}
          </span>
        </div>
      )}
      {product.weight && (
        <div className="flex items-center text-sm text-gray-600">
          <Package className="h-4 w-4 mr-2" />
          <span className="font-medium text-gray-800 mr-2">Weight:</span>
          <span>
            {product.weight} {product.weightUnit}
          </span>
        </div>
      )}
    </div>
  );
}
