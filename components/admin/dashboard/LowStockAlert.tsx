// components/admin/dashboard/LowStockAlert.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface LowStockAlertProps {
  products: Product[];
}

export function LowStockAlert({ products }: LowStockAlertProps) {
  const lowStockProducts = products.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Low Stock Alert</CardTitle>
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
                return (
                  <div
                    key={product._id}
                    className="p-3 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 flex-1 truncate">
                        {product.name}
                      </span>
                      <Badge variant={isCritical ? "destructive" : "secondary"}>
                        {product.countInStock} left
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="link" className="w-full mt-4" asChild>
              <Link href="/admin/products?filter=low-stock">
                View all low stock items
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
