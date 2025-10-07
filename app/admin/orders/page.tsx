// app/admin/orders/page.tsx
"use client";

import { AdminOrdersView } from "@/components/admin/orders/AdminOrdersView";

import { useOrders } from "@/hooks/use-orders";
import { useDebounce } from "@/hooks/use-debounce"; // A custom hook for debouncing search input
import { OrderStatus } from "@/types/order";
import { useState } from "react";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { ErrorDisplay } from "@/components/favorites/ErrorDisplay";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce the search query to avoid excessive API calls while typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use the admin-specific 'useOrders' hook
  const { data, isLoading, error } = useOrders({
    page,
    limit: 15, // Admins might want to see more items per page
    status: statusFilter === "all" ? undefined : statusFilter,
    // Note: Your useOrders hook would need to support a search/keyword param
    // For now, we assume the backend's APIFeatures handles a 'keyword' or 'search' query param
    keyword: debouncedSearchQuery || undefined,
  });

  if (isLoading && !data) {
    // Show a full-page loader only on the initial load
    return <LoadingDisplay />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error.message || "Failed to load orders. Please try again."}
      />
    );
  }

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  return (
    <AdminOrdersView
      orders={orders}
      pagination={pagination}
      isLoading={isLoading} // Pass loading state for inline indicators
      // State and handlers for filters
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      // Handler for pagination
      onPageChange={setPage}
    />
  );
}
