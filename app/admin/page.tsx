// app/admin/page.tsx
"use client";

import { DashboardHeader } from "@/components/admin/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/admin/dashboard/DashboardStats";
import { LowStockAlert } from "@/components/admin/dashboard/LowStockAlert";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { TopProducts } from "@/components/admin/dashboard/TopProducts";
import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorState from "@/components/shared/ErrorState";
import { useOrderAnalytics } from "@/hooks/use-orders";
import {
  useLowStockProducts,
  useProductStats,
} from "@/hooks/use-product-queries";
import { AnalyticsParams } from "@/types/order";
import { subDays, format } from "date-fns";
import { useMemo, useState } from "react";

function AdminDashboardContent() {
  const [dateRangeValue, setDateRangeValue] = useState("30d");

  const analyticsParams: AnalyticsParams = useMemo(() => {
    const endDate = new Date();
    let startDate = new Date();

    switch (dateRangeValue) {
      case "7d":
        startDate = subDays(endDate, 7);
        break;
      case "90d":
        startDate = subDays(endDate, 90);
        break;
      case "1y":
        startDate = subDays(endDate, 365);
        break;
      case "30d":
      default:
        startDate = subDays(endDate, 30);
        break;
    }

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      compareWithPrevious: true,
    };
  }, [dateRangeValue]);

  const {
    data: analytics,
    isLoading: isLoadingAnalytics,
    error,
  } = useOrderAnalytics(analyticsParams);

  const { data: productStats, isLoading: isLoadingProducts } =
    useProductStats();

  const { data: lowStockData, isLoading: isLoadingLowStock } =
    useLowStockProducts({ threshold: 10 });

  const isLoading =
    isLoadingAnalytics || isLoadingProducts || isLoadingLowStock;

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <LoadingDisplay />
      </div>
    );
  }

  if (error || !analytics || !productStats) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <ErrorState error={error} title="Failed to load dashboard data" />
      </div>
    );
  }

  return (
    // FIX: Removed 'pb-20' which created unnecessary gap.
    // Added 'flex-1' to ensure it fills the parent main container.
    <div className="flex-1 w-full bg-gray-50/50 flex flex-col pb-12">
      <DashboardHeader
        dateRange={dateRangeValue}
        onRangeChange={setDateRangeValue}
      />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DashboardStats
          analytics={analytics.data}
          productStats={productStats.data}
        />

        {/* 
            FIX: Grid container has min-w-0 to prevent overflow issues 
            which can sometimes force horizontal scrolling or break layout 
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full min-w-0">
          <div className="lg:col-span-2 space-y-8 min-w-0">
            <RevenueChart analytics={analytics.data} range={dateRangeValue} />
            <RecentOrders />
            <TopProducts products={analytics.data.products.topSelling} />
          </div>

          <div className="space-y-8 min-w-0">
            <QuickActions />
            <LowStockAlert products={lowStockData?.data || []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute userType="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
