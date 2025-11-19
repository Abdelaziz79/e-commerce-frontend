// components/brand/hooks/useBrandFilters.ts

import { useState, useMemo, useCallback, useEffect } from "react";
import { BrandsParams, BrandSearchParams } from "@/types/brand";
import { useDebounce } from "@/hooks/use-debounce";
import { ViewModeStorage } from "@/lib/brandViewModeStorage";

export type BrandStatusFilter = "all" | "active" | "inactive";

export function useBrandFilters() {
  const viewModeStorage = ViewModeStorage.getInstance();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-createdAt");
  const [statusFilter, setStatusFilter] = useState<BrandStatusFilter>("all");
  const [viewMode, setViewModeState] = useState<"grid" | "list">(
    viewModeStorage.get()
  );

  // Debounce search query with custom hook
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Load view mode from localStorage on mount
  useEffect(() => {
    const savedViewMode = viewModeStorage.get();
    setViewModeState(savedViewMode);
  }, []);

  const setViewMode = (mode: "grid" | "list") => {
    setViewModeState(mode);
    viewModeStorage.set(mode);
  };

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
      limit: 16,
      sort: sortOrder,
    };
  }, [debouncedSearchQuery, page, sortOrder, isSearchMode]);

  // Build regular query params
  const queryParams: BrandsParams = useMemo(() => {
    const params: BrandsParams = {
      page,
      limit: 16,
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
    viewMode,
    setViewMode,
    isSearchMode,
    searchParams,
    queryParams,
    handlePageChange,
    setSearchQuery: handleSearchQueryChange,
    handleSortChange,
    handleStatusChange,
  };
}
