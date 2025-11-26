// components/admin/dashboard/TopProducts.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopProduct } from "@/types/order";
import { ArrowUpRight, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  if (!products || products.length === 0) {
    return (
      // FIX: Removed 'h-full'. Use 'w-full' to ensure width consistency.
      <Card className="w-full shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex flex-col items-center justify-center text-gray-500">
            <Package className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No sales data yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    // FIX: Removed 'h-full'. The card will now naturally fit its content.
    <Card className="w-full min-w-0 shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Top Selling Products</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs h-8">
          <Link href="/admin/products" className="gap-1">
            View all
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.slice(0, 5).map((product, index) => {
            return (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3
                    className="text-sm font-medium text-gray-900 truncate"
                    title={product.productName}
                  >
                    {product.productName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-100">
                      {product.totalQuantity} sold
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    $
                    {product.totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-[10px] text-green-600 font-medium">
                      #{index + 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
