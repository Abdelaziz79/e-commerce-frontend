// hooks/use-admin-products.ts
/**
 * Comprehensive admin hook for product management
 * Combines queries and mutations for admin dashboard
 */

import { ProductsParams } from "@/types/product";
import { useState } from "react";
import {
  useAdjustProductStock,
  useBulkDeleteProducts,
  useBulkUpdateProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from "./use-product-mutations";
import {
  useLowStockProducts,
  useProductStats,
  useProducts,
} from "./use-product-queries";

export function useAdminProducts(initialParams: ProductsParams = {}) {
  const [params, setParams] = useState<ProductsParams>(initialParams);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Queries
  const productsQuery = useProducts(params);
  const statsQuery = useProductStats();
  const lowStockQuery = useLowStockProducts({ threshold: 10 });

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const bulkUpdateMutation = useBulkUpdateProducts();
  const bulkDeleteMutation = useBulkDeleteProducts();
  const adjustStockMutation = useAdjustProductStock();

  // Handlers
  const handleSearch = (keyword: string) => {
    setParams((prev) => ({ ...prev, keyword, page: 1 }));
  };

  const handleFilterChange = (filters: Partial<ProductsParams>) => {
    setParams((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleSortChange = (sort: string) => {
    setParams((prev) => ({ ...prev, sort }));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    if (productsQuery.data?.data) {
      setSelectedProductIds(productsQuery.data.data.map((p) => p._id));
    }
  };

  const clearSelection = () => {
    setSelectedProductIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedProductIds.length === 0) return;
    bulkDeleteMutation.mutate(
      { productIds: selectedProductIds },
      {
        onSuccess: () => clearSelection(),
      }
    );
  };

  const handleBulkUpdate = (updates: Partial<ProductsParams>) => {
    if (selectedProductIds.length === 0) return;
    bulkUpdateMutation.mutate(
      { productIds: selectedProductIds, updates },
      {
        onSuccess: () => clearSelection(),
      }
    );
  };

  // Derived state
  const hasSelection = selectedProductIds.length > 0;
  const isAllSelected =
    productsQuery.data?.data &&
    selectedProductIds.length === productsQuery.data.data.length &&
    selectedProductIds.length > 0;

  return {
    // Data
    products: productsQuery.data?.data || [],
    stats: statsQuery.data?.data,
    lowStockProducts: lowStockQuery.data?.data || [],
    pagination: productsQuery.data
      ? {
          page: productsQuery.data.page,
          pages: productsQuery.data.pages,
          total: productsQuery.data.total,
          results: productsQuery.data.results,
        }
      : null,

    // Loading states
    isLoading: productsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    isLoadingLowStock: lowStockQuery.isLoading,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending ||
      bulkUpdateMutation.isPending ||
      bulkDeleteMutation.isPending ||
      adjustStockMutation.isPending,

    // Error states
    error: productsQuery.error,
    statsError: statsQuery.error,
    lowStockError: lowStockQuery.error,

    // Mutations
    createProduct: createMutation.mutate,
    updateProduct: updateMutation.mutate,
    deleteProduct: deleteMutation.mutate,
    bulkUpdate: handleBulkUpdate,
    bulkDelete: handleBulkDelete,
    adjustStock: adjustStockMutation.mutate,

    // Selection
    selectedProductIds,
    toggleProductSelection,
    selectAllProducts,
    clearSelection,
    hasSelection,
    isAllSelected,

    // Filters & Pagination
    params,
    setParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    handleSortChange,

    // Refetch
    refetch: productsQuery.refetch,
    refetchStats: statsQuery.refetch,
    refetchLowStock: lowStockQuery.refetch,
  };
}

// Helper hook for quick stock status checking
export function useProductStockStatus(threshold: number = 10) {
  const statsQuery = useProductStats();
  const lowStockQuery = useLowStockProducts({ threshold });

  const stats = statsQuery.data?.data;

  return {
    totalProducts: stats?.totalProducts[0]?.count || 0,
    outOfStockCount: stats?.outOfStock[0]?.count || 0,
    lowStockCount: lowStockQuery.data?.results || 0,
    featuredCount: stats?.featured[0]?.count || 0,
    onSaleCount: stats?.onSale[0]?.count || 0,
    isLoading: statsQuery.isLoading || lowStockQuery.isLoading,
  };
}

// Helper hook for category/brand breakdown
export function useProductBreakdown() {
  const statsQuery = useProductStats();

  const stats = statsQuery.data?.data;

  return {
    byCategory:
      stats?.byCategory.map((item) => ({
        id: item._id,
        name: item.categoryInfo[0]?.name || "Unknown",
        count: item.count,
      })) || [],
    byBrand:
      stats?.byBrand.map((item) => ({
        id: item._id,
        name: item.brandInfo[0]?.name || "Unknown",
        count: item.count,
      })) || [],
    averagePrice: stats?.averagePrice[0]?.avg || 0,
    totalValue: stats?.totalValue[0]?.total || 0,
    isLoading: statsQuery.isLoading,
  };
}
