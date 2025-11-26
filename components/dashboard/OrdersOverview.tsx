// components/dashboard/OrdersOverview.tsx - UPDATED VERSION
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrderStatsResponse } from "@/types/order";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";

interface OrdersOverviewProps {
  stats: OrderStatsResponse["data"];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  bgColor?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendUp,
  color = "text-gray-600",
  bgColor = "bg-gray-50",
}: StatCardProps) {
  return (
    <Card className="border border-gray-200 shadow-none hover:shadow-sm transition-all duration-200 overflow-hidden group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              {title}
            </p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
          <div
            className={`p-2.5 rounded-lg ${bgColor} group-hover:opacity-90 transition-opacity`}
          >
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  trendUp ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 ${trendUp ? "" : "rotate-180"}`}
                />
                {trend}
              </span>
            )}
            {subtitle && <span className="text-gray-500">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OrdersOverview({ stats }: OrdersOverviewProps) {
  // Calculate in-progress orders (pending + processing)
  const inProgressOrders = stats.pendingOrders + stats.processingOrders;

  // Calculate success rate (completed + delivered / total paid orders)
  const successfulOrders = stats.completedOrders + (stats.deliveredOrders || 0);
  const successRate =
    stats.paidOrdersCount > 0
      ? ((successfulOrders / stats.paidOrdersCount) * 100).toFixed(0)
      : "0";

  return (
    <div className="space-y-6">
      {/* Main Stats - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`${stats.paidOrdersCount} paid`}
          icon={ShoppingBag}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Total Spent"
          value={`$${stats.totalSpent.toFixed(2)}`}
          subtitle={`Avg: $${stats.averageOrderValue.toFixed(2)}`}
          icon={DollarSign}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <StatCard
          title="In Progress"
          value={inProgressOrders}
          subtitle={`${stats.pendingOrders} pending, ${stats.processingOrders} processing`}
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="Completed"
          value={stats.completedOrders}
          subtitle={`${successRate}% success rate`}
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
      </div>

      {/* Secondary Stats - Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <Truck className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Shipped
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.shippedOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <PackageCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Delivered
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.deliveredOrders || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Cancelled
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.cancelledOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Package className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  All Statuses
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {Object.keys(stats.statusCounts || {}).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
