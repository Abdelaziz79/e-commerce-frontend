// app/admin/products/create/components/MultiProductSelector.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchProducts } from "@/hooks/use-product-queries";
import { Product } from "@/types/product";
import { Check, Loader2, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MultiProductSelectorProps {
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
}

export function MultiProductSelector({
  selectedProductIds,
  onSelectionChange,
}: MultiProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: searchResults, isLoading } = useSearchProducts(
    { q: debouncedSearch, limit: 10 },
    debouncedSearch.length > 1
  );

  const handleToggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      onSelectionChange(selectedProductIds.filter((id) => id !== productId));
    } else {
      onSelectionChange([...selectedProductIds, productId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start font-normal h-11 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Search products to add...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-lg border-gray-200">
        <div className="p-3 border-b bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="pl-9 h-10 text-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white"
            />
          </div>
        </div>
        <ScrollArea className="h-80">
          <div className="p-1.5">
            {isLoading && (
              <div className="flex justify-center items-center p-8">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Searching...</p>
                </div>
              </div>
            )}
            {!isLoading &&
              (!searchResults || searchResults.data.length === 0) && (
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                    {debouncedSearch.length > 1 ? (
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Search className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {debouncedSearch.length > 1
                      ? "No products found"
                      : "Start typing to search"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {debouncedSearch.length > 1
                      ? "Try different keywords"
                      : "Enter a product name or SKU"}
                  </p>
                </div>
              )}
            {!isLoading &&
              searchResults &&
              searchResults.data.map((product: Product) => {
                const isSelected = selectedProductIds.includes(product._id);
                return (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleToggleProduct(product._id)}
                    className={`w-full flex items-center gap-3 p-3 text-sm rounded-lg text-left transition-all ${
                      isSelected
                        ? "bg-blue-50 hover:bg-blue-100 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 border-2 rounded flex-shrink-0 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 shadow-sm"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white" />
                      )}
                    </div>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-50 border border-gray-200 flex-shrink-0">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isSelected ? "text-gray-900" : "text-gray-800"
                        }`}
                      >
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-green-600 font-medium">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
