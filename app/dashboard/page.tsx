// app/dashboard/page.tsx
"use client";

import { LoadingDisplay } from "@/components/cart/LoadingDisplay";
import { AccountSummary } from "@/components/dashboard/AccountSummary";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OrdersOverview } from "@/components/dashboard/OrdersOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { RecentReviews } from "@/components/dashboard/RecentReviews";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ErrorState from "@/components/shared/ErrorState";
import { useMyOrders, useUserOrderStats } from "@/hooks/use-orders";
import { useMyReviews } from "@/hooks/use-review-hooks";
import { useUserProfile } from "@/hooks/use-user-mutations";

function UserDashboardContent() {
  const { data: profile, isLoading: isLoadingProfile } = useUserProfile();
  const { data: orderStats, isLoading: isLoadingStats } = useUserOrderStats();
  const { data: recentOrders, isLoading: isLoadingOrders } = useMyOrders({
    limit: 3,
    sort: "-createdAt",
  });
  const { data: recentReviews, isLoading: isLoadingReviews } = useMyReviews({
    limit: 3,
  });

  const isLoading =
    isLoadingProfile || isLoadingStats || isLoadingOrders || isLoadingReviews;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <LoadingDisplay />
      </div>
    );
  }

  if (!profile || !orderStats) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <ErrorState error={null} title="Failed to load dashboard data" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={profile.data} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrdersOverview stats={orderStats.data} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
          {/* Main Content - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            <RecentOrders orders={recentOrders?.data?.orders || []} />
            <RecentReviews reviews={recentReviews?.data?.reviews || []} />
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4 space-y-6">
            <QuickActions />
            <AccountSummary user={profile.data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute userType="user">
      <UserDashboardContent />
    </ProtectedRoute>
  );
}
