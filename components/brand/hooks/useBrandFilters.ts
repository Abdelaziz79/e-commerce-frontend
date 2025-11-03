// components/brand/hooks/useBrandFilters.ts

import { useState, useMemo, useCallback } from "react";
import { BrandsParams, BrandSearchParams } from "@/types/brand";
import { useDebounce } from "@/hooks/use-debounce";
export type BrandStatusFilter = "all" | "active" | "inactive";

export function useBrandFilters() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-createdAt");
  const [statusFilter, setStatusFilter] = useState<BrandStatusFilter>("all");

  // Debounce search query with custom hook
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((order: string) => {
    setSortOrder(order);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status: BrandStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  // Determine if we should use search or regular query
  const isSearchMode = debouncedSearchQuery.trim().length > 0;

  // Build search params
  const searchParams: BrandSearchParams | null = useMemo(() => {
    if (!isSearchMode) return null;

    return {
      q: debouncedSearchQuery,
      page,
      limit: 12,
      sort: sortOrder,
    };
  }, [debouncedSearchQuery, page, sortOrder, isSearchMode]);

  // Build regular query params
  const queryParams: BrandsParams = useMemo(() => {
    const params: BrandsParams = {
      page,
      limit: 12,
      sort: sortOrder,
    };

    // Add status filter to regular queries
    if (statusFilter === "active") {
      params.isActive = true;
    } else if (statusFilter === "inactive") {
      params.isActive = false;
    }

    return params;
  }, [page, sortOrder, statusFilter]);

  return {
    page,
    searchQuery,
    debouncedSearchQuery,
    sortOrder,
    statusFilter,
    isSearchMode,
    searchParams,
    queryParams,
    handlePageChange,
    setSearchQuery: handleSearchQueryChange,
    handleSortChange,
    handleStatusChange,
  };
}
