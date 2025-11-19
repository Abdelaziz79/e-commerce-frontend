// components/dashboard/RecentOrders.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { formatOrderStatus } from "@/hooks/use-orders";
import { ArrowRight, Package, Truck, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface RecentOrdersProps {
  orders: Order[];
}

function getStatusIcon(status: string) {
  switch (status) {
    case "delivered":
    case "completed":
      return CheckCircle;
    case "shipped":
      return Truck;
    case "processing":
      return Clock;
    default:
      return Package;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "delivered":
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    case "shipped":
      return "default";
    default:
      return "secondary";
  }
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-none">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-50 rounded-full mb-4">
              <Package className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500 mb-5 max-w-sm mx-auto">
              Start shopping to see your orders appear here
            </p>
            <Button asChild size="sm">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link
              href="/orders"
              className="text-sm gap-1 hover:gap-2 transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);

            return (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                className="block p-5 hover:bg-gray-50/50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  {/* Order Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-200">
                    {order.orderItems[0]?.image && (
                      <Image
                        src={order.orderItems[0].image}
                        alt={order.orderItems[0].name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={getStatusColor(order.status)}
                        className="flex items-center gap-1 text-xs"
                      >
                        <StatusIcon className="w-3 h-3" />
                        {formatOrderStatus(order.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {order.orderItems.length} item
                        {order.orderItems.length > 1 ? "s" : ""}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        ${order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
