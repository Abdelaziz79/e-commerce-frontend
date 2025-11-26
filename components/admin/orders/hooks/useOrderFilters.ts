// hooks/useOrderFilters.ts - UPDATED VERSION
import { useState, useMemo, useCallback, useEffect } from "react";
import { OrdersParams, OrderStatus, SearchOrdersParams } from "@/types/order";
import { useDebounce } from "@/hooks/use-debounce";

export type OrderStatusFilter = OrderStatus | "all";

export function useOrderFilters() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, statusFilter]);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleStatusChange = useCallback((status: OrderStatusFilter) => {
    setStatusFilter(status);
  }, []);

  // Determine if we should use search or regular fetch
  const shouldUseSearch = Boolean(debouncedSearchQuery.trim());

  // Query params for regular orders fetch (no search)
  const ordersQueryParams: OrdersParams = useMemo(() => {
    const params: OrdersParams = {
      page,
      limit: 15,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter as OrderStatus;
    }

    return params;
  }, [page, statusFilter]);

  // Search params for search orders
  const searchQueryParams: SearchOrdersParams = useMemo(() => {
    const params: SearchOrdersParams = {
      q: debouncedSearchQuery,
      page,
      limit: 15,
    };

    // Note: If your backend supports status filtering in search,
    // you might need to add it as a query parameter
    // params.status = statusFilter !== "all" ? statusFilter : undefined;

    return params;
  }, [debouncedSearchQuery, page]);

  return {
    page,
    searchQuery,
    debouncedSearchQuery,
    statusFilter,
    shouldUseSearch,
    ordersQueryParams,
    searchQueryParams,
    handlePageChange,
    setSearchQuery: handleSearchQueryChange,
    handleStatusChange,
  };
}
