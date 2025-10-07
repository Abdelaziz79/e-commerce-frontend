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
import { useOrderStatusColor } from "@/hooks/use-orders";
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

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
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
                  <TableCell>{getUserName(order.user)}</TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/orders/${order._id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
