// components/admin/dashboard/RecentOrders.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/use-orders";
import { OrderStatus } from "@/types/order";
import { ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const statusConfig: Record<
    string,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
      className?: string;
    }
  > = {
    completed: {
      variant: "default",
      label: "Completed",
      className:
        "bg-green-100 text-green-700 hover:bg-green-100/80 border-transparent shadow-none",
    },
    processing: {
      variant: "default",
      label: "Processing",
      className:
        "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-transparent shadow-none",
    },
    pending: {
      variant: "secondary",
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-transparent shadow-none",
    },
    shipped: {
      variant: "default",
      label: "Shipped",
      className:
        "bg-purple-100 text-purple-700 hover:bg-purple-100/80 border-transparent shadow-none",
    },
    cancelled: { variant: "destructive", label: "Cancelled" },
    refunded: { variant: "destructive", label: "Refunded" },
    "on-hold": { variant: "secondary", label: "On Hold" },
    failed: { variant: "destructive", label: "Failed" },
    delivered: {
      variant: "default",
      label: "Delivered",
      className:
        "bg-green-100 text-green-700 hover:bg-green-100/80 border-transparent shadow-none",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}

export function RecentOrders() {
  const { data, isLoading } = useOrders({ limit: 5, sort: "-createdAt" });
  const orders = data?.data?.orders || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-xs h-8">
          <Link href="/admin/orders" className="gap-1">
            View all
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {/* FIX: Wrapper div with overflow-x-auto handles responsive table scrolling */}
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const customerName =
                  typeof order.user === "object" && order.user !== null
                    ? order.user.name
                    : "Guest / Deleted";

                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium text-xs pl-6">
                      #{order.orderNumber}
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {customerName}
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-900"
                        asChild
                      >
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
