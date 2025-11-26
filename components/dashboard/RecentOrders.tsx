// components/dashboard/RecentOrders.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatOrderStatus } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { ArrowRight, CheckCircle, Clock, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

function getStatusColor(
  status: string
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "delivered":
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Recent Orders
          </h3>
        </div>
        <div className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-full mb-3">
              <Package className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">
              No orders yet
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Start shopping to see your orders appear here
            </p>
            <Button asChild size="sm" variant="outline">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Recent Orders</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href="/orders"
            className="text-xs gap-1 hover:gap-2 transition-all"
          >
            View all
            <ArrowRight className="w-3 h-3" />
          </Link>
        </Button>
      </div>
      <div className="divide-y divide-slate-100">
        {orders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block p-5 hover:bg-slate-50/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                {/* Order Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-200">
                  {order.orderItems[0]?.image && (
                    <Image
                      src={order.orderItems[0].image}
                      alt={order.orderItems[0].name}
                      width={56}
                      height={56}
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={getStatusColor(order.status)}
                      className="flex items-center gap-1 text-xs whitespace-nowrap"
                    >
                      <StatusIcon className="w-3 h-3" />
                      {formatOrderStatus(order.status)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {order.orderItems.length} item
                      {order.orderItems.length > 1 ? "s" : ""}
                    </span>
                    <span className="font-bold text-slate-900">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
