// app/admin/products/create/components/RelatedProductsForm.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProduct } from "@/hooks/use-product-queries";
import { Product } from "@/types/product";
import { Link2, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { MultiProductSelector } from "./MultiProductSelector";

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
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 h-[68px] animate-pulse">
        <div className="h-12 w-12 rounded-md bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!productData) return null;

  const product = productData.data as Product;

  return (
    <div className="group flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-200 transition-all animate-in fade-in duration-300">
      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-contain p-1"
          sizes="48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-medium text-green-600">
            ${product.price.toFixed(2)}
          </span>
          {product.countInStock > 0 ? (
            <span className="text-xs text-gray-500 bg-green-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-xs text-gray-500 bg-red-50 px-2 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(productId)}
        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <div className="p-2 rounded-lg bg-cyan-50">
            <Link2 className="h-4 w-4 text-cyan-600" />
          </div>
          Related Products
        </CardTitle>
        <p className="text-sm text-gray-500">
          Suggest complementary or similar items to increase cross-selling
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <MultiProductSelector
          selectedProductIds={selectedProductIds}
          onSelectionChange={onSelectionChange}
        />

        {selectedProductIds.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Selected Products ({selectedProductIds.length})
              </h3>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
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
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30">
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-600 font-medium">
              No related products selected
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Search and add products to display as recommendations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
