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
import { useMemo, useState } from "react";

export default function UserOrdersPage() {
  // State management
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Data fetching
  const { data, isLoading, error } = useMyOrders({
    page,
    limit: 10, // Or your preferred limit
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const cancelOrderMutation = useCancelOrder();

  // Memoized filtering of orders based on search query
  const filteredOrders = useMemo(() => {
    const orders = data?.data?.orders || [];
    if (!searchQuery) {
      return orders;
    }
    return orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems.some((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [data?.data?.orders, searchQuery]);

  // Event handlers
  const handleCancelOrder = async (reason: string) => {
    if (!orderToCancel) return;

    await cancelOrderMutation.mutateAsync(
      {
        orderId: orderToCancel._id,
        data: { reason },
      },
      {
        onSuccess: () => {
          setOrderToCancel(null); // Close the dialog on success
        },
      }
    );
  };

  if (error) {
    return (
      <ErrorDisplay
        message={
          error.message || "Failed to load your orders. Please try again."
        }
      />
    );
  }

  const pagination = data?.data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <OrdersHeader />

      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {isLoading ? (
        <OrdersSkeleton />
      ) : (
        <OrderList
          orders={filteredOrders}
          searchQuery={searchQuery}
          onSelectCancelOrder={setOrderToCancel}
        />
      )}

      {pagination && pagination.totalPages > 1 && !isLoading && (
        <OrdersPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
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
