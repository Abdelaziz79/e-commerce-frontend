// app/orders/page.tsx
"use client";

import { ErrorDisplay } from "@/components/favorites/ErrorDisplay";
import { CancelOrderDialog } from "@/components/orders/CancelOrderDialog";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { OrderList } from "@/components/orders/OrderList";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersPagination } from "@/components/orders/OrdersPagination";
import { OrdersSkeleton } from "@/components/orders/OrdersSkeleton";
import { useCancelOrder, useMyOrders } from "@/hooks/use-orders";
import { Order, OrderStatus } from "@/types/order";
import { useEffect, useMemo, useState } from "react";

export default function UserOrdersPage() {
  // State management
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Data fetching - IMPORTANT: Don't filter on client if backend supports it
  // Backend search uses keyword parameter, not client-side filtering
  const { data, isLoading, error, refetch } = useMyOrders({
    page,
    limit: 10,
    status: statusFilter === "all" ? undefined : statusFilter,
    // If backend supports keyword search, pass it here:
    // keyword: searchQuery || undefined,
  });

  const cancelOrderMutation = useCancelOrder();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery]);

  // Client-side filtering (only if backend doesn't support keyword search)
  // If your backend supports keyword search, remove this and pass keyword to useMyOrders
  const filteredOrders = useMemo(() => {
    const orders = data?.data?.orders || [];
    if (!searchQuery.trim()) {
      return orders;
    }

    const query = searchQuery.toLowerCase().trim();
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(query) ||
        order.orderItems.some((item) =>
          item.name.toLowerCase().includes(query)
        ) ||
        order.shippingAddress.address.toLowerCase().includes(query) ||
        order.shippingAddress.city.toLowerCase().includes(query)
    );
  }, [data?.data?.orders, searchQuery]);

  // Event handlers
  const handleCancelOrder = async (reason: string) => {
    if (!orderToCancel) return;

    cancelOrderMutation.mutate(
      {
        orderId: orderToCancel._id,
        data: { reason: reason.trim() || undefined },
      },
      {
        onSuccess: () => {
          setOrderToCancel(null);
          // Refetch to get updated data
          refetch();
        },
      }
    );
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <OrdersHeader />
        <ErrorDisplay
          message={
            error.message || "Failed to load your orders. Please try again."
          }
        />
      </div>
    );
  }

  const pagination = data?.data?.pagination;
  const hasOrders = (data?.data?.orders?.length ?? 0) > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <OrdersHeader />

      {/* Only show filters if there are orders or if filters are active */}
      {(hasOrders || statusFilter !== "all" || searchQuery) && (
        <OrderFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      )}

      {isLoading ? (
        <OrdersSkeleton />
      ) : (
        <OrderList
          orders={filteredOrders}
          searchQuery={searchQuery}
          onSelectCancelOrder={setOrderToCancel}
        />
      )}

      {/* Show pagination only if there are multiple pages and not loading */}
      {pagination && pagination.totalPages > 1 && !isLoading && (
        <OrdersPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CancelOrderDialog
        order={orderToCancel}
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirmCancel={handleCancelOrder}
        isPending={cancelOrderMutation.isPending}
      />
    </div>
  );
}
