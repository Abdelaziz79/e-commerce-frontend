"use client";

import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Search, X } from "lucide-react";
import { ProductsParams } from "@/types/product";
import { BulkActions } from "./BulkActions";
import { Button } from "@/components/ui/button";
import { useSearchableInfiniteAdminCategories } from "@/hooks/use-category-hooks";
import { useSearchableInfiniteAdminBrands } from "@/hooks/use-brand-hooks";
import { SearchableSelect } from "../create/SearchableSelect";

interface TableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  params: ProductsParams;
  onFilterChange: (filters: Partial<ProductsParams>) => void;
  onClearFilters: () => void;
  selectedProductIds: string[];
  onBulkDelete: () => void;
  isMutating: boolean;
  isSearching: boolean;
  clearSelection: () => void;
  isSearchMode?: boolean;
}

export function TableToolbar({
  searchQuery,
  onSearchChange,
  params,
  onFilterChange,
  onClearFilters,
  selectedProductIds,
  onBulkDelete,
  isMutating,
  isSearching,
  clearSelection,
  isSearchMode = false,
}: TableToolbarProps) {
  const hasActiveFilters = !!searchQuery || !!params.category || !!params.brand;

  // Disable category/brand filters when in search mode
  const filtersDisabled = isSearchMode;

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-10 pr-10 text-sm border-gray-200 rounded-none focus:ring-1 focus:ring-gray-900"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
          {searchQuery && !isSearching && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto sm:min-w-[200px] relative">
          <SearchableSelect
            value={params.category || null}
            onValueChange={(val) =>
              onFilterChange({ category: val || undefined })
            }
            useSearchableInfiniteQuery={useSearchableInfiniteAdminCategories}
            placeholder="Category"
          />
          {filtersDisabled && (
            <div className="absolute inset-0 bg-gray-50/50 cursor-not-allowed rounded pointer-events-none" />
          )}
        </div>

        {/* Brand Filter */}
        <div className="w-full sm:w-auto sm:min-w-[200px] relative">
          <SearchableSelect
            value={params.brand || null}
            onValueChange={(val) => onFilterChange({ brand: val || undefined })}
            useSearchableInfiniteQuery={useSearchableInfiniteAdminBrands}
            placeholder="Brand"
          />
          {filtersDisabled && (
            <div className="absolute inset-0 bg-gray-50/50 cursor-not-allowed rounded pointer-events-none" />
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-9 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-4 w-4 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search Mode Indicator */}
      {isSearchMode && (
        <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Search mode active. Category and brand filters are disabled. Clear
            search to use filters.
          </span>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedProductIds.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <BulkActions
            selectedIds={selectedProductIds}
            onDelete={onBulkDelete}
            isMutating={isMutating}
            clearSelection={clearSelection}
          />
        </div>
      )}
    </div>
  );
}
