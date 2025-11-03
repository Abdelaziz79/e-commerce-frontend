// app/admin/orders/page.tsx
"use client";

import { AdminOrdersView } from "@/components/admin/orders/AdminOrdersView";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { ErrorDisplay } from "@/components/favorites/ErrorDisplay";
import { useDebounce } from "@/hooks/use-debounce";
import { useExportOrders, useOrders } from "@/hooks/use-orders";
import { OrderStatus } from "@/types/order";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce the search query to avoid excessive API calls while typing
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Export orders mutation
  const exportOrdersMutation = useExportOrders();

  // Use the admin-specific 'useOrders' hook
  const { data, isLoading, error } = useOrders({
    page,
    limit: 15,
    status: statusFilter === "all" ? undefined : statusFilter,
    keyword: debouncedSearchQuery || undefined,
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearchQuery]);

  // Handle export orders
  const handleExportOrders = () => {
    exportOrdersMutation.mutate({
      status: statusFilter === "all" ? undefined : statusFilter,
    });
  };

  // Handle page change with scroll to top
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading && !data) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <LoadingDisplay />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ErrorDisplay
          message={error.message || "Failed to load orders. Please try again."}
        />
      </div>
    );
  }

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  return (
    <AdminOrdersView
      orders={orders}
      pagination={pagination}
      isLoading={isLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      onPageChange={handlePageChange}
      onExportOrders={handleExportOrders}
      isExporting={exportOrdersMutation.isPending}
    />
  );
}
