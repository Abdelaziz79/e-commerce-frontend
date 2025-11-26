// components/admin/dashboard/LowStockAlert.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LowStockProduct } from "@/types/product";
import { AlertCircle, Zap } from "lucide-react";
import Link from "next/link";

interface LowStockAlertProps {
  products: LowStockProduct[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.slice(0, 5);
  const criticalCount = products.filter((p) => p.countInStock < 5).length;

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Low Stock Alert</CardTitle>
            {criticalCount > 0 && (
              <p className="text-xs text-red-600 mt-1">
                {criticalCount} critical items need immediate attention
              </p>
            )}
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            All products are well stocked!
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {lowStockProducts.map((product) => {
                const isCritical = product.countInStock < 5;
                const hasVariationIssues =
                  product.hasLowVariations &&
                  product.lowStockVariations &&
                  product.lowStockVariations.length > 0;

                return (
                  <div
                    key={product._id}
                    className={`p-3 rounded-lg border transition-colors`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                          {product.name}
                        </span>
                        <Badge
                          variant={isCritical ? "destructive" : "secondary"}
                        >
                          {product.countInStock} left
                        </Badge>
                      </div>

                      {hasVariationIssues && (
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs text-yellow-700">
                            {product?.lowStockVariations?.length} variation
                            {product.lowStockVariations?.length &&
                            product.lowStockVariations?.length > 1
                              ? "s"
                              : ""}{" "}
                            low in stock
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="link" className="w-full mt-4" asChild>
              <Link href="/admin/stock">
                View all low stock items ({products.length})
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
