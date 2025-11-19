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
    OrderStatus,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
    }
  > = {
    completed: { variant: "default", label: "Completed" },
    processing: { variant: "default", label: "Processing" },
    pending: { variant: "secondary", label: "Pending" },
    shipped: { variant: "default", label: "Shipped" },
    cancelled: { variant: "destructive", label: "Cancelled" },
    refunded: { variant: "destructive", label: "Refunded" },
    "on-hold": { variant: "secondary", label: "On Hold" },
    failed: { variant: "destructive", label: "Failed" },
    delivered: { variant: "default", label: "Delivered" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return <Badge variant={config.variant}>{config.label}</Badge>;
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
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/orders" className="gap-1">
            View all
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const customerName =
                  typeof order.user === "string"
                    ? "N/A"
                    : order.user?.name || "N/A";
                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell className="font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
