// components/admin/orders/AdminOrdersView.tsx
import { OrdersPagination } from "@/components/orders/OrdersPagination";
import { Order, OrderStatus, PaginatedOrdersResponse } from "@/types/order";
import { AdminOrdersFilters } from "./AdminOrdersFilters";
import { AdminOrdersHeader } from "./AdminOrdersHeader";
import { AdminOrdersTable } from "./AdminOrdersTable";

interface AdminOrdersViewProps {
  orders: Order[];
  pagination: PaginatedOrdersResponse["data"]["pagination"] | undefined;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: OrderStatus | "all") => void;
  onPageChange: (page: number) => void;
  onExportOrders: () => void;
  isExporting: boolean;
}

export function AdminOrdersView({
  orders,
  pagination,
  isLoading,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onPageChange,
  onExportOrders,
  isExporting,
}: AdminOrdersViewProps) {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <AdminOrdersHeader
        orderCount={pagination?.total ?? 0}
        onExport={onExportOrders}
        isExporting={isExporting}
      />
      <div className="mt-6">
        <AdminOrdersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
        <div className="mt-4">
          <AdminOrdersTable orders={orders} isLoading={isLoading} />
        </div>
        {pagination && pagination.totalPages > 1 && !isLoading && (
          <div className="mt-6">
            <OrdersPagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
