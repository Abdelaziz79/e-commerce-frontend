// components/category/hooks/useCategoryFilters.ts

import { useState, useMemo, useCallback } from "react";
import { CategoriesParams, CategorySearchParams } from "@/types/category";
import { useDebounce } from "@/hooks/use-debounce";

export type CategoryStatusFilter = "all" | "active" | "inactive";

export function useCategoryFilters() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("-createdAt");
  const [statusFilter, setStatusFilter] = useState<CategoryStatusFilter>("all");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSortChange = useCallback((order: string) => {
    setSortOrder(order);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status: CategoryStatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const isSearchMode = debouncedSearchQuery.trim().length > 0;

  const searchParams: CategorySearchParams | null = useMemo(() => {
    if (!isSearchMode) return null;

    return {
      q: debouncedSearchQuery,
      page,
      limit: 16,
      sort: sortOrder,
    };
  }, [debouncedSearchQuery, page, sortOrder, isSearchMode]);

  const queryParams: CategoriesParams = useMemo(() => {
    const params: CategoriesParams = {
      page,
      limit: 16,
      sort: sortOrder,
    };

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
