// components/dashboard/OrderInsights.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrderStatsResponse } from "@/types/order";
import { AlertCircle, Info, ShoppingCart, TrendingUp } from "lucide-react";

interface OrderInsightsProps {
  stats: OrderStatsResponse["data"];
}

interface Insight {
  type: "success" | "warning" | "info";
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function OrderInsights({ stats }: OrderInsightsProps) {
  // Calculate various metrics
  const totalActiveOrders =
    stats.pendingOrders + stats.processingOrders + stats.shippedOrders;

  const completionRate =
    stats.paidOrdersCount > 0
      ? ((stats.completedOrders / stats.paidOrdersCount) * 100).toFixed(1)
      : "0";

  const cancellationRate =
    stats.totalOrders > 0
      ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)
      : "0";

  const insights: Insight[] = [];

  // Active orders insight
  if (totalActiveOrders > 0) {
    insights.push({
      type: "info",
      message: `You have ${totalActiveOrders} order${
        totalActiveOrders > 1 ? "s" : ""
      } currently being processed or shipped.`,
      icon: ShoppingCart,
    });
  }

  // High spending insight
  if (stats.totalSpent > 500 && stats.totalOrders >= 3) {
    insights.push({
      type: "success",
      message: `You're a valued customer! You've spent $${stats.totalSpent.toFixed(
        2
      )} across ${stats.totalOrders} orders.`,
      icon: TrendingUp,
    });
  }

  // Low completion rate warning
  if (parseFloat(completionRate) < 70 && stats.paidOrdersCount >= 5) {
    insights.push({
      type: "warning",
      message: `Your order completion rate is ${completionRate}%. Consider checking order statuses regularly.`,
      icon: AlertCircle,
    });
  }

  // High cancellation rate warning
  if (parseFloat(cancellationRate) > 20 && stats.totalOrders >= 5) {
    insights.push({
      type: "warning",
      message: `${cancellationRate}% of your orders have been cancelled. Let us know if you need assistance!`,
      icon: AlertCircle,
    });
  }

  // No orders yet
  if (stats.totalOrders === 0) {
    insights.push({
      type: "info",
      message: "Start shopping to track your orders here!",
      icon: Info,
    });
  }

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {insights.map((insight, index) => {
        const config = {
          success: {
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            textColor: "text-emerald-900",
            iconColor: "text-emerald-600",
            dotColor: "bg-emerald-400",
          },
          warning: {
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
            textColor: "text-amber-900",
            iconColor: "text-amber-600",
            dotColor: "bg-amber-400",
          },
          info: {
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            textColor: "text-blue-900",
            iconColor: "text-blue-600",
            dotColor: "bg-blue-400",
          },
        };

        const styles = config[insight.type];
        const Icon = insight.icon || Info;

        return (
          <Card
            key={index}
            className={`border ${styles.borderColor} ${styles.bgColor} shadow-none hover:shadow-sm transition-all duration-200`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`p-2 rounded-lg ${styles.bgColor}`}>
                    <Icon className={`w-4 h-4 ${styles.iconColor}`} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${styles.textColor}`}>
                    {insight.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
