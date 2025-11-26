// components/users/admin/UserOrdersSection.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UserOrdersSectionProps {
  orders: Order[];
  totalOrders: number;
}

export function UserOrdersSection({
  orders,
  totalOrders,
}: UserOrdersSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayOrders = showAll ? orders : orders.slice(0, 5);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (orders.length === 0) {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders
          </CardTitle>
        </CardHeader>
        <Separator className="opacity-50" />
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm">No orders yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Orders
          </CardTitle>
          <Badge variant="secondary" className="font-semibold">
            {totalOrders} total
          </Badge>
        </div>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="pt-6">
        <div className="space-y-3">
          {displayOrders.map((order) => (
            <Link
              key={order._id}
              href={`/admin/orders/${order._id}`}
              className="block p-4 rounded-lg border border-border/50 hover:bg-muted/30 hover:border-border transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm font-mono">
                      {order.orderNumber}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0 capitalize ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      {order.orderItems.length} item
                      {order.orderItems.length > 1 ? "s" : ""}
                    </p>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-base mb-1">
                    ${order.totalPrice.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    View Details
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
              {order.isPaid && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0 border-green-200 text-green-700 bg-green-50"
                  >
                    Paid
                  </Badge>
                </div>
              )}
            </Link>
          ))}
        </div>

        {orders.length > 5 && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `Show All ${totalOrders} Orders`}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
