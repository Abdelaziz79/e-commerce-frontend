// components/dashboard/StatsOverview.tsx
"use client";

import { OrderStatsResponse } from "@/types/order";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
  XCircle,
  TrendingUp,
} from "lucide-react";

interface StatsOverviewProps {
  stats: OrderStatsResponse["data"];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "amber" | "emerald" | "purple" | "red";
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    icon: "text-blue-600",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    icon: "text-green-600",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    icon: "text-amber-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    icon: "text-emerald-600",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    icon: "text-purple-600",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    icon: "text-red-600",
  },
};

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  const config = colorConfig[color];

  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-6 transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.icon}`} />
        </div>
      </div>
    </div>
  );
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const inProgressOrders = stats.pendingOrders + stats.processingOrders;
  const successfulOrders = stats.completedOrders + (stats.deliveredOrders || 0);
  const successRate =
    stats.paidOrdersCount > 0
      ? ((successfulOrders / stats.paidOrdersCount) * 100).toFixed(0)
      : "0";

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          subtitle={`${stats.paidOrdersCount} paid`}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Total Spent"
          value={`$${stats.totalSpent.toFixed(2)}`}
          subtitle={`Avg: $${stats.averageOrderValue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={inProgressOrders}
          subtitle={`${stats.pendingOrders} pending`}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={stats.completedOrders}
          subtitle={`${successRate}% success rate`}
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Shipped</p>
              <p className="text-lg font-bold text-slate-900">
                {stats.shippedOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50">
              <PackageCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Delivered</p>
              <p className="text-lg font-bold text-slate-900">
                {stats.deliveredOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Cancelled</p>
              <p className="text-lg font-bold text-slate-900">
                {stats.cancelledOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Avg Value</p>
              <p className="text-lg font-bold text-slate-900">
                ${stats.averageOrderValue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
