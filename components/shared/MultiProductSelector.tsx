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
import { Check, Loader2, Search } from "lucide-react";
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
          className="w-full justify-start font-normal h-9 text-sm border-gray-200 hover:bg-gray-50 rounded-none"
        >
          <Search className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-500">Search products to add...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0 shadow-md border-gray-200 rounded-none">
        <div className="p-2 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="pl-8 h-8 text-xs border-gray-200 rounded-none"
            />
          </div>
        </div>
        <ScrollArea className="h-80">
          <div className="p-1">
            {isLoading && (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
            {!isLoading &&
              (!searchResults || searchResults.data.length === 0) && (
                <div className="text-center p-8">
                  <p className="text-xs text-gray-500">
                    {debouncedSearch.length > 1
                      ? "No products found"
                      : "Start typing to search"}
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
                    className={`w-full flex items-center gap-3 p-2 text-xs transition-colors ${
                      isSelected
                        ? "bg-gray-100 border border-gray-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 border flex-shrink-0 flex items-center justify-center ${
                        isSelected
                          ? "bg-gray-900 border-gray-900"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="relative h-8 w-8 bg-gray-50 border border-gray-200 flex-shrink-0">
                      <Image
                        src={product.mainImage}
                        alt={product.name}
                        fill
                        className="object-contain p-0.5"
                        sizes="32px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p
                        className={`font-medium truncate ${
                          isSelected ? "text-gray-900" : "text-gray-800"
                        }`}
                      >
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
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
