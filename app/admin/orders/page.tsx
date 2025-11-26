// app/admin/orders/page.tsx - FIXED VERSION
"use client";

import { AdminOrdersView } from "@/components/admin/orders/AdminOrdersView";
import { useOrderFilters } from "@/components/admin/orders/hooks/useOrderFilters";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import ErrorState from "@/components/shared/ErrorState";
import {
  useExportOrders,
  useOrderAnalytics,
  useOrders,
  useSearchOrders,
} from "@/hooks/use-orders";
import { AnalyticsParams } from "@/types/order";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export default function AdminOrdersPage() {
  const {
    searchQuery,
    statusFilter,
    shouldUseSearch,
    ordersQueryParams,
    searchQueryParams,
    handlePageChange,
    setSearchQuery,
    handleStatusChange,
  } = useOrderFilters();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const exportOrdersMutation = useExportOrders();

  // FIXED: Prepare analytics params with proper type
  const analyticsParams: AnalyticsParams = useMemo(() => {
    const params: AnalyticsParams = {
      compareWithPrevious: true,
    };

    if (dateRange?.from) {
      params.startDate = format(dateRange.from, "yyyy-MM-dd");
    }
    if (dateRange?.to) {
      params.endDate = format(dateRange.to, "yyyy-MM-dd");
    }

    return params;
  }, [dateRange]);

  // FIXED: Pass analyticsParams directly - React Query will handle re-fetching
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useOrderAnalytics(analyticsParams);

  // Use search or regular fetch based on whether there's a search query
  const ordersQueryResult = useOrders(ordersQueryParams);
  const searchQueryResult = useSearchOrders(searchQueryParams);

  // Choose which query result to use
  const { data, isLoading, error } = shouldUseSearch
    ? searchQueryResult
    : ordersQueryResult;

  const handleExportOrders = () => {
    const exportParams: AnalyticsParams = {
      status: statusFilter === "all" ? undefined : statusFilter,
    };

    if (dateRange?.from) {
      exportParams.startDate = format(dateRange.from, "yyyy-MM-dd");
    }
    if (dateRange?.to) {
      exportParams.endDate = format(dateRange.to, "yyyy-MM-dd");
    }

    exportOrdersMutation.mutate(exportParams);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  // Show loading state only on initial load
  if ((isLoading || isLoadingAnalytics) && !data && !analyticsData) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <LoadingDisplay />
      </div>
    );
  }

  // Show error state if orders fail to load (analytics failure is non-critical)
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ErrorState
          error={error}
          title={error.message || "Failed to load orders. Please try again."}
        />
      </div>
    );
  }

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;
  const analytics = analyticsData?.data;

  return (
    <AdminOrdersView
      orders={orders}
      pagination={pagination}
      analytics={analytics}
      isLoading={isLoading}
      isLoadingAnalytics={isLoadingAnalytics}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      statusFilter={statusFilter}
      setStatusFilter={handleStatusChange}
      onPageChange={handlePageChange}
      onExportOrders={handleExportOrders}
      isExporting={exportOrdersMutation.isPending}
      onDateRangeChange={handleDateRangeChange}
    />
  );
}
