// components/admin/orders/AdminOrdersTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatOrderStatus, useOrderStatusColor } from "@/hooks/use-orders";
import { Order } from "@/types/order";
import { format } from "date-fns";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface AdminOrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

export function AdminOrdersTable({ orders, isLoading }: AdminOrdersTableProps) {
  const getStatusColor = useOrderStatusColor;

  const getUserName = (user: Order["user"]) => {
    if (typeof user === "object" && user !== null && "name" in user) {
      return user.name;
    }
    return "N/A";
  };

  const getUserEmail = (user: Order["user"]) => {
    if (typeof user === "object" && user !== null && "email" in user) {
      return user.email;
    }
    return "";
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading &&
                orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="hover:underline"
                      >
                        #{order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {getUserName(order.user)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getUserEmail(order.user)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getStatusColor(order.status)}
                      >
                        {formatOrderStatus(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          order.isPaid
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                        }
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View order details</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
