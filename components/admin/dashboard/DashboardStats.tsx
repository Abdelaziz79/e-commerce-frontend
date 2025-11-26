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
  subtext?: string;
}

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconColor,
  subtext,
}: StatCardProps) {
  // Determine trend direction
  const hasChange = typeof change === "number";
  const isPositive = change && change >= 0;
  const isNeutral = change === 0;

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const trendColor = isNeutral
    ? "text-gray-500"
    : isPositive
    ? "text-green-600"
    : "text-red-600";

  return (
    <Card className="hover:shadow-md transition-shadow border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>

            <div className="flex items-center gap-2">
              {hasChange && !isNeutral && (
                <div
                  className={`flex items-center gap-1 ${trendColor} bg-opacity-10 px-1.5 py-0.5 rounded text-xs font-medium`}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{Math.abs(change!).toFixed(1)}%</span>
                </div>
              )}
              <span className="text-xs text-gray-400">
                {subtext || "vs previous period"}
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${iconBgColor}`}>
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
  const { overview, periodAnalysis, customers } = analytics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={`$${overview.totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        change={periodAnalysis.growth.revenue}
        icon={DollarSign}
        iconBgColor="bg-green-50"
        iconColor="text-green-600"
      />
      <StatCard
        title="Total Orders"
        value={overview.totalOrders.toLocaleString()}
        change={periodAnalysis.growth.orders}
        icon={ShoppingCart}
        iconBgColor="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatCard
        title="Active Products"
        value={productStats.totalProducts[0]?.count?.toLocaleString() || 0}
        // Product growth isn't in analytics usually, so we omit change or pass 0
        change={0}
        subtext="Total items in catalog"
        icon={Package}
        iconBgColor="bg-orange-50"
        iconColor="text-orange-600"
      />
      <StatCard
        title="Total Customers"
        value={customers.stats.uniqueCustomers.toLocaleString()}
        // Assuming repeatCustomerRate as a proxy for health, or calculate growth if available
        change={customers.loyalty.repeatCustomerRate}
        subtext="Repeat customer rate"
        icon={Users}
        iconBgColor="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  );
}
