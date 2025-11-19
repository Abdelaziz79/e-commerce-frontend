// app/admin/products/create/components/RelatedProductsForm.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProduct } from "@/hooks/use-product-queries";
import { Product } from "@/types/product";
import { Link2, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { MultiProductSelector } from "../../shared/MultiProductSelector";

interface RelatedProductsFormProps {
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
}

function SelectedProductCard({
  productId,
  onRemove,
}: {
  productId: string;
  onRemove: (id: string) => void;
}) {
  const { data: productData, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 h-[68px] animate-pulse">
        <div className="h-12 w-12 bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 w-3/4" />
          <div className="h-3 bg-gray-200 w-1/4" />
        </div>
      </div>
    );
  }

  if (!productData) return null;

  const product = productData.data as Product;

  return (
    <div className="group flex items-center gap-3 p-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="relative h-12 w-12 bg-gray-50 flex-shrink-0 border border-gray-200">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-contain p-1"
          sizes="48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.countInStock > 0 ? (
            <span className="text-xs text-gray-500">In Stock</span>
          ) : (
            <span className="text-xs text-red-600">Out of Stock</span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(productId)}
        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function RelatedProductsForm({
  selectedProductIds,
  onSelectionChange,
}: RelatedProductsFormProps) {
  const handleRemoveProduct = (productId: string) => {
    onSelectionChange(selectedProductIds.filter((id) => id !== productId));
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Link2 className="h-4 w-4 text-gray-500" />
          Related Products
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        <MultiProductSelector
          selectedProductIds={selectedProductIds}
          onSelectionChange={onSelectionChange}
        />

        {selectedProductIds.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-900">
              Selected Products ({selectedProductIds.length})
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {selectedProductIds.map((id) => (
                <SelectedProductCard
                  key={id}
                  productId={id}
                  onRemove={handleRemoveProduct}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 bg-gray-50">
            <ShoppingBag className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-medium text-gray-600">
              No products selected
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Search and add related products
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
