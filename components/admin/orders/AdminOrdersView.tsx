// components/admin/orders/AdminOrdersView.tsx - ENHANCED VERSION
"use client";

import { PaginationControls } from "@/components/PaginationControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Order,
  OrderAnalyticsResponse,
  PaginatedOrdersResponse,
} from "@/types/order";
import { BarChart3, List } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AdminOrdersAnalytics } from "./AdminOrdersAnalytics";
import { AdminOrdersFilters } from "./AdminOrdersFilters";
import { AdminOrdersHeader } from "./AdminOrdersHeader";
import { AdminOrdersTable } from "./AdminOrdersTable";
import { AnalyticsDateRangePicker } from "./AnalyticsDateRangePicker";
import { OrderStatusFilter } from "./hooks/useOrderFilters";

interface AdminOrdersViewProps {
  orders: Order[];
  pagination: PaginatedOrdersResponse["data"]["pagination"] | undefined;
  analytics: OrderAnalyticsResponse["data"] | undefined;
  isLoading: boolean;
  isLoadingAnalytics: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: OrderStatusFilter;
  setStatusFilter: (status: OrderStatusFilter) => void;
  onPageChange: (page: number) => void;
  onExportOrders: () => void;
  isExporting: boolean;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function AdminOrdersView({
  orders,
  pagination,
  analytics,
  isLoading,
  isLoadingAnalytics,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onPageChange,
  onExportOrders,
  isExporting,
  onDateRangeChange,
}: AdminOrdersViewProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-6">
        <AdminOrdersHeader
          orderCount={pagination?.total ?? 0}
          onExport={onExportOrders}
          isExporting={isExporting}
        />

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-gray-100 p-1 text-gray-600 shadow-sm">
            <TabsTrigger
              value="orders"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <List className="h-4 w-4 mr-2" />
              Orders List
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-lg px-4 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {onDateRangeChange && (
              <div className="flex justify-between items-center bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    Date Range Filter
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Select a custom date range for analytics
                  </p>
                </div>
                <AnalyticsDateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
            )}

            <AdminOrdersAnalytics
              analytics={analytics}
              isLoading={isLoadingAnalytics}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
