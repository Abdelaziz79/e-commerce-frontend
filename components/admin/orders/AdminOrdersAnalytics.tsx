// components/admin/orders/AdminOrdersAnalytics.tsx - ENHANCED VERSION
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderAnalyticsResponse } from "@/types/order";
import {
  DollarSign,
  Package,
  TrendingUp,
  Clock,
  Calendar,
  ShoppingCart,
  Users,
  ArrowUp,
  ArrowDown,
  MapPin,
  CreditCard,
  Tag,
  Percent,
  Trophy,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AdminOrdersAnalyticsProps {
  analytics: OrderAnalyticsResponse["data"] | undefined;
  isLoading: boolean;
}

export function AdminOrdersAnalytics({
  analytics,
  isLoading,
}: AdminOrdersAnalyticsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-40 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-40 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value?.toFixed(1)}%`;
  };

  // Overview Cards Data
  const overviewCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(analytics.overview.totalRevenue),
      description: `${analytics.overview.totalPaidOrders} paid orders`,
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      growth: analytics.periodAnalysis.growth.revenue,
    },
    {
      title: "Total Orders",
      value: analytics.overview.totalOrders.toLocaleString(),
      description: "All time orders",
      icon: Package,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      growth: analytics.periodAnalysis.growth.orders,
    },
    {
      title: "Average Order Value",
      value: formatCurrency(analytics.overview.averageOrderValue),
      description: "Per transaction",
      icon: TrendingUp,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      growth: analytics.periodAnalysis.growth.averageOrderValue,
    },
    {
      title: "Unique Customers",
      value: analytics.customers.stats.uniqueCustomers.toLocaleString(),
      description: `${analytics.customers.loyalty.repeatCustomerRate?.toFixed(
        1
      )}% repeat rate`,
      icon: Users,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Quick Stats Cards
  const quickStatsCards = [
    {
      title: "Last 24 Hours",
      orders: analytics.quickStats.last24Hours.orders,
      revenue: formatCurrency(analytics.quickStats.last24Hours.revenue),
      icon: Clock,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Last 7 Days",
      orders: analytics.quickStats.last7Days.orders,
      revenue: formatCurrency(analytics.quickStats.last7Days.revenue),
      icon: Calendar,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Last 30 Days",
      orders: analytics.quickStats.last30Days.orders,
      revenue: formatCurrency(analytics.quickStats.last30Days.revenue),
      icon: ShoppingCart,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Avg Fulfillment",
      orders:
        analytics.operations.fulfillment.averageFulfillmentDays?.toFixed(1),
      revenue: "days",
      icon: Package,
      iconColor: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  // Prepare chart data
  const monthlyRevenueData = analytics.trends.monthly.map((item) => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    revenue: item.revenue,
    orders: item.orders,
    avgOrderValue: item.averageOrderValue,
  }));

  const dailyRevenueData = analytics.trends.daily.slice(-30).map((item) => ({
    date: `${item._id.month}/${item._id.day}`,
    revenue: item.revenue,
    orders: item.orders,
  }));

  const statusData = Object.entries(analytics.statusDistribution).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: getStatusColor(status),
    })
  );

  const paymentMethodData = analytics.financial.paymentMethods.map((pm) => ({
    method: pm._id,
    revenue: pm.totalRevenue,
    count: pm.count,
    avgValue: pm.averageOrderValue,
  }));

  const topProductsData = analytics.products.topSelling
    .slice(0, 10)
    .map((p) => {
      // Build variation info if exists
      let variationInfo = "";
      if (p.uniqueVariations && p.uniqueVariations.length > 0) {
        const topVariation = p.uniqueVariations[0];
        const varParts = [];
        if (topVariation.size) varParts.push(topVariation.size);
        if (topVariation.color) varParts.push(topVariation.color);
        if (varParts.length > 0) {
          variationInfo = ` (${varParts.join(", ")})`;
        }
      }

      const fullName = `${p.productName}${variationInfo}`;

      return {
        name:
          fullName.length > 35 ? fullName.substring(0, 32) + "..." : fullName,
        quantity: p.totalQuantity,
        revenue: p.totalRevenue,
      };
    });
  const geographyData = analytics.geography.topCountries
    .slice(0, 5)
    .map((c) => ({
      country: c._id,
      orders: c.orders,
      revenue: c.revenue,
    }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          const hasGrowth = card.growth !== undefined;
          const isPositive = hasGrowth && card.growth >= 0;

          return (
            <Card
              key={index}
              className="border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-600">{card.description}</p>
                  {hasGrowth && (
                    <div
                      className={`flex items-center text-xs font-medium ${
                        isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-0.5" />
                      )}
                      {formatPercentage(card.growth)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStatsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              className="border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.orders}
                </div>
                <p className="text-xs text-gray-600 mt-1">{card.revenue}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              Monthly Revenue Trend (Last 12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200"
                  />
                  <XAxis
                    dataKey="month"
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          name === "revenue"
                            ? formatCurrency(Number(value))
                            : value,
                          name === "revenue" ? "Revenue" : "Orders",
                        ]}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Revenue (Last 30 Days) */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              Daily Revenue (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyRevenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "Revenue",
                        ]}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gray-600" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                quantity: {
                  label: "Quantity Sold",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical">
                  {" "}
                  {/* ✅ Changed to vertical */}
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    className="text-xs text-gray-600"
                    width={150}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => [
                          `${value} units (${formatCurrency(
                            props.payload.revenue
                          )})`,
                          props.payload.name,
                        ]}
                      />
                    }
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#f59e0b"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              Order Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100)?.toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [value, name]}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              Revenue by Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200"
                  />
                  <XAxis
                    dataKey="method"
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => [
                          formatCurrency(Number(value)),
                          "Revenue",
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-600" />
              Top Countries by Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={geographyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200"
                  />
                  <XAxis
                    dataKey="country"
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs text-gray-600"
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => [
                          `${value} orders`,
                          props.payload.country,
                        ]}
                      />
                    }
                  />
                  <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Conversion Metrics */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Percent className="h-5 w-5 text-gray-600" />
              Conversion Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payment Conversion</span>
              <span className="text-sm font-semibold text-gray-900">
                {analytics.operations.statusBreakdown.conversionMetrics.paymentConversionRate?.toFixed(
                  1
                )}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-semibold text-gray-900">
                {analytics.operations.statusBreakdown.conversionMetrics.completionRate?.toFixed(
                  1
                )}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cancellation Rate</span>
              <span className="text-sm font-semibold text-red-600">
                {analytics.operations.statusBreakdown.conversionMetrics.cancellationRate?.toFixed(
                  1
                )}
                %
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Loyalty */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-600" />
              Customer Loyalty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Repeat Customers</span>
              <span className="text-sm font-semibold text-gray-900">
                {analytics.customers.loyalty.repeatCustomers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Repeat Rate</span>
              <span className="text-sm font-semibold text-green-600">
                {analytics.customers.loyalty.repeatCustomerRate?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Lifetime Value</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(
                  analytics.customers.loyalty.averageLifetimeValue
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Discounts & Refunds */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-gray-600" />
              Discounts & Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Discounts</span>
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(
                  analytics.financial.discounts.summary.totalDiscountGiven
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Orders with Discount
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {analytics.financial.discounts.summary.ordersWithDiscount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Refunds</span>
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(analytics.financial.refunds.totalRefundAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function for status colors
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "#eab308",
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
    refunded: "#f97316",
    "on-hold": "#6b7280",
    failed: "#dc2626",
    completed: "#059669",
  };
  return colors[status] || "#6b7280";
}
