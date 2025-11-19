// components/admin/dashboard/TopProducts.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrderAnalytics } from "@/hooks/use-orders";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export function TopProducts() {
  const { data, isLoading } = useOrderAnalytics();

  const topProducts = data?.data?.topProducts || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Top Selling Products</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products" className="gap-1">
            View all
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.slice(0, 4).map((product, index) => {
            const trend = index % 2 === 0 ? "up" : "down";
            return (
              <div
                key={product._id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.productName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.totalQuantity} units sold
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="text-sm font-semibold text-gray-900">
                    ${product.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    trend === "up" ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
