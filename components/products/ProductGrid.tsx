// app/products/components/ProductGrid.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { SortDropdown } from "./SortDropdown";

interface ProductGridProps {
  data?: {
    results: number;
    total: number;
    pages: number;
    data: Product[];
  };
  isLoading: boolean;
  error: Error | null;
  page: number;
  setPage: (page: number) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export function ProductGrid({
  data,
  isLoading,
  error,
  page,
  setPage,
  sortBy,
  setSortBy,
}: ProductGridProps) {
  const totalPages = data?.pages || 1;

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-lg">
            Failed to load products. Please try again.
          </p>
        </div>
      ) : data?.data && data.data.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="text-gray-600 text-sm">
              Showing {data.results} of {data.total} products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="rounded-md"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className="rounded-md"
                >
                  Next
                </Button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">
            No products found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}
