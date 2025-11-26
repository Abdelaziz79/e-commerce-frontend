// components/admin/dashboard/RevenueChart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { OrderAnalyticsResponse } from "@/types/order";
import { BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  analytics: OrderAnalyticsResponse["data"];
  range: string;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RevenueChart({ analytics, range }: RevenueChartProps) {
  const useDaily = range === "7d" || range === "30d";
  const rawData = useDaily ? analytics.trends.daily : analytics.trends.monthly;

  const chartData = rawData.map((item) => {
    let dateLabel = "";
    if ("day" in item._id) {
      dateLabel = `${item._id.month}/${item._id.day}`;
    } else {
      const date = new Date(item._id.year, item._id.month - 1);
      dateLabel = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    }

    return {
      date: dateLabel,
      revenue: item.revenue,
      orders: item.orders,
    };
  });

  if (chartData.length === 0) {
    return (
      <Card className="col-span-1 min-w-0 shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-50 rounded-lg flex flex-col items-center justify-center border border-dashed border-gray-200">
            <BarChart3 className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">
              No revenue data for this period
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-0 shadow-sm border-gray-200">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* FIX: min-w-0 prevents flex items from overflowing */}
        <div className="h-[300px] w-full min-w-0">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart accessibilityLayer data={chartData}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  className="stroke-gray-100"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs text-gray-500 font-medium"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="text-xs text-gray-500 font-medium"
                  tickFormatter={(value) =>
                    `$${
                      value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                    }`
                  }
                />
                <ChartTooltip
                  cursor={{ fill: "transparent", stroke: "#e5e7eb" }}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [
                        `$${Number(value).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}`,
                        "Revenue",
                      ]}
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
