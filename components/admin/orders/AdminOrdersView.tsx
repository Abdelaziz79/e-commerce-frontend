// components/admin/orders/AdminOrdersView.tsx - FIXED VERSION
import { PaginationControls } from "@/components/PaginationControls";
import { Order, PaginatedOrdersResponse } from "@/types/order";
import { AdminOrdersFilters } from "./AdminOrdersFilters";
import { AdminOrdersHeader } from "./AdminOrdersHeader";
import { AdminOrdersTable } from "./AdminOrdersTable";
import { OrderStatusFilter } from "./hooks/useOrderFilters";

interface AdminOrdersViewProps {
  orders: Order[];
  pagination: PaginatedOrdersResponse["data"]["pagination"] | undefined;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: OrderStatusFilter;
  setStatusFilter: (status: OrderStatusFilter) => void;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        <AdminOrdersHeader
          orderCount={pagination?.total ?? 0}
          onExport={onExportOrders}
          isExporting={isExporting}
        />

        <AdminOrdersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <AdminOrdersTable orders={orders} isLoading={isLoading} />

        {pagination && pagination.totalPages > 1 && !isLoading && (
          <div className="flex justify-center">
            <PaginationControls
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
