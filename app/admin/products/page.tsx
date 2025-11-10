// app/admin/products/page.tsx
"use client";

import { useAdminProducts } from "@/hooks/use-admin-products";
import { ProductsHeader } from "@/components/products/admin/ProductsHeader";
import { StatCards } from "@/components/products/admin/StatCards";
import { TableToolbar } from "@/components/products/admin/TableToolbar";
import { ProductsTable } from "@/components/products/admin/ProductsTable";
import { TablePagination } from "@/components/products/admin/TablePagination";
import { TableSkeleton } from "@/components/products/admin/TableSkeleton";
import { ProductsError } from "@/components/products/admin/ProductsError";
import { StockAdjustmentDialog } from "@/components/products/admin/StockAdjustmentDialog";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { ProductsParams, Product } from "@/types/product";
import { useSearchProducts } from "@/hooks/use-product-queries";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedProductForStock, setSelectedProductForStock] =
    useState<Product | null>(null);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);

  const {
    products: filteredProducts,
    pagination: filteredPagination,
    isLoading: isFilterLoading,
    isMutating,
    error: filterError,
    params,
    setParams,
    selectedProductIds,
    isAllSelected,
    selectAllProducts,
    toggleProductSelection,
    clearSelection,
    bulkDelete,
    refetch: refetchFiltered,
  } = useAdminProducts({ limit: 10, sort: "-createdAt" });

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useSearchProducts(
    {
      q: debouncedSearch,
      page: params.page || 1,
      limit: params.limit || 10,
    },
    isSearchMode && debouncedSearch.length >= 2
  );

  useEffect(() => {
    setIsSearchMode(debouncedSearch.length >= 2);
  }, [debouncedSearch]);

  const products = isSearchMode ? searchData?.data || [] : filteredProducts;
  const pagination = isSearchMode
    ? searchData
      ? {
          page: searchData.page,
          pages: searchData.pages,
          total: searchData.total,
          results: searchData.results,
        }
      : null
    : filteredPagination;
  const isLoading = isSearchMode ? isSearchLoading : isFilterLoading;
  const error = isSearchMode ? searchError : filterError;
  const refetch = isSearchMode ? () => {} : refetchFiltered;

  const handleFilterChange = (filters: Partial<ProductsParams>) => {
    setSearchQuery("");
    setIsSearchMode(false);
    setParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setIsSearchMode(false);
    setParams({
      limit: 10,
      sort: "-createdAt",
      page: 1,
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setIsSearchMode(false);
    }
  };

  const handlePageChange = (page: number) => {
    setParams((p) => ({ ...p, page }));
  };

  const handleAdjustStock = (product: Product) => {
    setSelectedProductForStock(product);
    // Use setTimeout to prevent blocking
    setTimeout(() => {
      setIsStockDialogOpen(true);
    }, 0);
  };

  const handleStockDialogClose = (open: boolean) => {
    setIsStockDialogOpen(open);
    if (!open) {
      // Clear selected product after dialog animation completes
      setTimeout(() => {
        setSelectedProductForStock(null);
      }, 200);
    }
  };

  const isSearching = debouncedSearch.length > 0 && isLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <ProductsHeader productCount={pagination?.total} />
        <StatCards />

        <Card className="border-gray-200 rounded-none overflow-hidden shadow-sm">
          <TableToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            params={params}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            selectedProductIds={selectedProductIds}
            onBulkDelete={bulkDelete}
            isMutating={isMutating}
            isSearching={isSearching}
            clearSelection={clearSelection}
            isSearchMode={isSearchMode}
          />

          <CardContent className="p-0">
            {isLoading && !products.length ? (
              <TableSkeleton />
            ) : error ? (
              <ProductsError
                error={error}
                onRetry={refetch}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <ProductsTable
                products={products}
                selectedProductIds={selectedProductIds}
                onSelectAll={() =>
                  isAllSelected ? clearSelection() : selectAllProducts()
                }
                onToggleSelect={toggleProductSelection}
                isAllSelected={isAllSelected ?? false}
                sort={params.sort || ""}
                onSortChange={(sort) => setParams((p) => ({ ...p, sort }))}
                isMutating={isLoading || isMutating}
                onAdjustStock={handleAdjustStock}
              />
            )}
          </CardContent>
        </Card>

        {!isLoading &&
          pagination &&
          pagination.total > 0 &&
          pagination.pages > 1 && (
            <TablePagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
      </div>

      <StockAdjustmentDialog
        product={selectedProductForStock}
        open={isStockDialogOpen}
        onOpenChange={handleStockDialogClose}
      />
    </div>
  );
}
