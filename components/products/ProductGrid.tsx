"use client";

import { PaginationControls } from "@/components/PaginationControls";
import { cn } from "@/lib/utils";
import { ViewModeStorage } from "@/lib/viewModeStorage";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import ErrorState from "../shared/ErrorState";
import EmptyProducts from "./EmptyProducts";
import LoadingProducts from "./LoadingProducts";
import { ProductCard } from "./ProductCard";
import { SortDropdown } from "./SortDropdown";
import { ViewMode, ViewModeToggle } from "./ViewModeToggle";

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
  onRetry?: () => void;
  onResetFilters?: () => void;
}

export function ProductGrid({
  data,
  isLoading,
  error,
  page,
  setPage,
  sortBy,
  setSortBy,
  onRetry,
  onResetFilters,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid-3");
  const [isMounted, setIsMounted] = useState(false);

  // Load view mode from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const storage = ViewModeStorage.getInstance();
    const savedMode = storage.get();
    setViewMode(savedMode);
  }, []);

  // Save view mode to localStorage when it changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (isMounted) {
      const storage = ViewModeStorage.getInstance();
      storage.set(mode);
    }
  };

  const getGridClass = () => {
    switch (viewMode) {
      case "grid-3":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-y-6";
      case "grid-4":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 sm:gap-y-6";
      case "list":
        return "flex flex-col";
      default:
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-y-6";
    }
  };

  const getProductPosition = (index: number, totalInRow: number) => {
    if (viewMode === "list") return "middle";
    const positionInRow = index % totalInRow;
    if (positionInRow === 0) return "left";
    if (positionInRow === totalInRow - 1) return "right";
    return "middle";
  };

  const getColumnsPerRow = () => {
    return viewMode === "grid-4" ? 4 : 3;
  };

  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Header */}
      <div className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          {/* Title & Results */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Products
            </h1>
            {data && !isLoading && (
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  {data.total.toLocaleString()} products found
                </p>
                {data.results > 0 && (
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    • Showing {(page - 1) * data.results + 1}-
                    {Math.min(page * data.results, data.total)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <ViewModeToggle
              viewMode={viewMode}
              setViewMode={handleViewModeChange}
            />
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingProducts />}

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState
          title="Oops! Something went wrong"
          error={error}
          onRetry={onRetry}
          onResetFilters={onResetFilters}
        />
      )}

      {/* Products Grid/List */}
      {!isLoading && !error && data?.data && data.data.length > 0 && (
        <>
          <div
            className={cn("animate-in fade-in duration-500", getGridClass())}
          >
            {data.data.map((product, index) => (
              <div
                key={product._id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <ProductCard
                  product={product}
                  view={viewMode === "list" ? "list" : "grid"}
                  position={getProductPosition(index, getColumnsPerRow())}
                  isLast={viewMode === "list" && index === data.data.length - 1}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className=" flex justify-center px-4 sm:px-0  outline-2 outline-white pt-8  ">
              <PaginationControls
                currentPage={page}
                totalPages={data.pages}
                onPageChange={setPage}
                totalResults={data.total}
                resultsPerPage={data.results}
              />
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !error && data?.data && data.data.length === 0 && (
        <EmptyProducts
          onResetFilters={onResetFilters}
          handleResetFilters={handleResetFilters}
        />
      )}
    </div>
  );
}
