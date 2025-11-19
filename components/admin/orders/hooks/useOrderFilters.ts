// hooks/useOrderFilters.ts - FIXED VERSION
import { useState, useMemo, useCallback, useEffect } from "react";
import { OrdersParams, OrderStatus } from "@/types/order";
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

  const queryParams: OrdersParams = useMemo(() => {
    const params: OrdersParams = {
      page,
      limit: 15,
    };

    if (statusFilter !== "all") {
      params.status = statusFilter as OrderStatus;
    }

    if (debouncedSearchQuery) {
      params.keyword = debouncedSearchQuery;
    }

    return params;
  }, [page, statusFilter, debouncedSearchQuery]);

  return {
    page,
    searchQuery,
    debouncedSearchQuery,
    statusFilter,
    queryParams,
    handlePageChange,
    setSearchQuery: handleSearchQueryChange,
    handleStatusChange,
  };
}
