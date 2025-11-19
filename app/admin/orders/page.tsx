// app/admin/orders/page.tsx - FIXED VERSION
"use client";

import { AdminOrdersView } from "@/components/admin/orders/AdminOrdersView";
import { useOrderFilters } from "@/components/admin/orders/hooks/useOrderFilters";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import ErrorState from "@/components/shared/ErrorState";
import { useExportOrders, useOrders } from "@/hooks/use-orders";

export default function AdminOrdersPage() {
  const {
    searchQuery,
    statusFilter,
    queryParams,
    handlePageChange,
    setSearchQuery,
    handleStatusChange,
  } = useOrderFilters();

  const exportOrdersMutation = useExportOrders();

  const { data, isLoading, error } = useOrders(queryParams);

  const handleExportOrders = () => {
    exportOrdersMutation.mutate({
      status: statusFilter === "all" ? undefined : statusFilter,
    });
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
        <ErrorState
          error={error}
          title={error.message || "Failed to load orders. Please try again."}
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
      setStatusFilter={handleStatusChange}
      onPageChange={handlePageChange}
      onExportOrders={handleExportOrders}
      isExporting={exportOrdersMutation.isPending}
    />
  );
}
