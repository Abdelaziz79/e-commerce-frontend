// components/admin/dashboard/DashboardStats.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrderAnalyticsResponse } from "@/types/order";
import { ProductStats } from "@/types/product";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

interface DashboardStatsProps {
  analytics: OrderAnalyticsResponse["data"];
  productStats: ProductStats;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  const hasChange = typeof change === "number";
  const isPositive = change && change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
            {hasChange && (
              <div className="flex items-center gap-1">
                <TrendIcon
                  className={`w-4 h-4 ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {Math.abs(change!)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({
  analytics,
  productStats,
}: DashboardStatsProps) {
  const totalProducts = productStats.totalProducts[0]?.count || 0;
  const totalRevenue = analytics.overview.totalRevenue || 0;
  const totalOrders = analytics.overview.totalOrders || 0;

  // Calculate changes (mock data - replace with actual historical comparison)
  const revenueChange = 12.5;
  const ordersChange = 8.2;
  const productsChange = -3.1;
  const customersChange = 15.3;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        change={revenueChange}
        icon={DollarSign}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatCard
        title="Total Orders"
        value={totalOrders.toLocaleString()}
        change={ordersChange}
        icon={ShoppingCart}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
      <StatCard
        title="Total Products"
        value={totalProducts.toLocaleString()}
        change={productsChange}
        icon={Package}
        iconBgColor="bg-orange-50"
        iconColor="text-orange-600"
      />
      <StatCard
        title="Total Customers"
        value="1,823"
        change={customersChange}
        icon={Users}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
    </div>
  );
}
