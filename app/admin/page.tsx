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

function AdminDashboardContent() {
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useOrderAnalytics();
  const { data: productStats, isLoading: isLoadingProducts } =
    useProductStats();
  const { data: lowStockData, isLoading: isLoadingLowStock } =
    useLowStockProducts({ threshold: 10 });

  const isLoading =
    isLoadingAnalytics || isLoadingProducts || isLoadingLowStock;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <LoadingDisplay />
      </div>
    );
  }

  if (!analytics || !productStats) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ErrorState error={null} title="Failed to load dashboard data" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardStats
          analytics={analytics.data}
          productStats={productStats.data}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <RecentOrders />
            <TopProducts />
            <RevenueChart analytics={analytics.data} />
          </div>

          <div className="space-y-6">
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
