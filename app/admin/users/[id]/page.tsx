// app/admin/users/[id]/page.tsx - FIXED VERSION
"use client";

import ErrorState from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { UserInfoCard } from "@/components/users/admin/UserInfoCard";
import { UserProfileSidebar } from "@/components/users/admin/UserProfileSidebar";
import { UserStatsGrid } from "@/components/users/admin/UserStatsGrid";
import { UserCartSection } from "@/components/users/admin/UserCartSection";
import { UserFavoritesSection } from "@/components/users/admin/UserFavoritesSection";
import { UserOrdersSection } from "@/components/users/admin/UserOrdersSection";
import { UserReviewsSection } from "@/components/users/admin/UserReviewsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminUser,
  useUserOrders,
  useUserReviews,
} from "@/hooks/use-admin-mutations";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // FIXED: Only fetch from admin endpoint - it includes everything
  const { data, isLoading, error, refetch } = useAdminUser(userId);

  // Fetch user orders
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useUserOrders(userId, { limit: 10, sort: "-createdAt" });

  // Fetch user reviews
  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useUserReviews(userId, { limit: 10, sort: "-createdAt" });

  if (isLoading) return <UserDetailsSkeleton />;

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <ErrorState
          error={error}
          onRetry={refetch}
          onResetFilters={() => router.push("/admin/users")}
          title="Failed to load user details"
        />
      </div>
    );
  }

  const { user, statistics } = data.data;

  // FIXED: Extract data directly from user object
  const cartItems = user.cart || [];
  const favorites = user.favorites || [];

  // Extract orders and reviews
  const orders = ordersData?.data || [];
  const totalOrders = ordersData?.total || 0;
  const reviews = reviewsData?.data || [];
  const totalReviews = reviewsData?.total || 0;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader
          pageTitle="User Details"
          pageDescription="View account metrics and manage permissions"
          headerButtons={[
            {
              title: "Back to Users",
              href: "/admin/users",
              icon: <ArrowLeft className="h-4 w-4" />,
            },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Identity & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <UserProfileSidebar user={user} />
          </div>

          {/* Right Column: Data & Stats */}
          <div className="lg:col-span-8 space-y-6">
            {/* Statistics Overview */}
            <UserStatsGrid stats={statistics} />

            {/* Account Information */}
            <UserInfoCard user={user} />

            {/* Tabbed Content */}
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="cart">Cart</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="mt-6">
                {ordersLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : ordersError ? (
                  <ErrorState
                    error={ordersError}
                    onRetry={refetch}
                    title="Failed to load orders"
                  />
                ) : (
                  <UserOrdersSection
                    orders={orders}
                    totalOrders={totalOrders}
                  />
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                {reviewsLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : reviewsError ? (
                  <ErrorState
                    error={reviewsError}
                    onRetry={refetch}
                    title="Failed to load reviews"
                  />
                ) : (
                  <UserReviewsSection
                    reviews={reviews}
                    totalReviews={totalReviews}
                  />
                )}
              </TabsContent>

              <TabsContent value="cart" className="mt-6">
                <UserCartSection cartItems={cartItems} />
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                <UserFavoritesSection favorites={favorites} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Skeleton className="lg:col-span-4 h-[500px] rounded-xl" />
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
