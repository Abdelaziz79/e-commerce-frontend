// components/admin/orders/AdminOrdersTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatOrderStatus, useOrderStatusColor } from "@/hooks/use-orders";
import { Order, OrderItem } from "@/types/order";
import { format } from "date-fns";
import {
  Eye,
  Loader2,
  Package,
  Mail,
  User,
  CreditCard,
  Tag,
  Truck,
} from "lucide-react";
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

  const getTotalItems = (orderItems: OrderItem[]) => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getPaymentMethodDisplay = (method: string) => {
    const methods: Record<string, string> = {
      card: "Credit Card",
      paypal: "PayPal",
      cod: "Cash on Delivery",
      bank: "Bank Transfer",
    };
    return methods[method] || method.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-50 hover:to-gray-100/50 border-b border-gray-200">
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Order
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Customer
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Date
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Payment
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Method
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
              Items
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
              Subtotal
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
              Tax
            </TableHead>
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
              Shipping
            </TableHead>
            {orders.some((o) => o.discountAmount > 0) && (
              <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
                Discount
              </TableHead>
            )}
            <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
              Total
            </TableHead>
            <TableHead className="h-11 w-[100px] text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={12} className="text-center h-64">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gray-900 rounded-full opacity-10 animate-ping" />
                    <div className="relative bg-white p-3 rounded-full shadow-sm border border-gray-200">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Loading orders...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={12} className="text-center h-64">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full bg-gray-100">
                    <Package className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      No orders found
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            orders.map((order) => (
              <TableRow
                key={order._id}
                className="group hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 last:border-0"
              >
                <TableCell className="py-4 px-6">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    <Package className="h-4 w-4 text-gray-400" />#
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium text-gray-900 text-sm">
                        {getUserName(order.user)}
                      </span>
                    </div>
                    {getUserEmail(order.user) && (
                      <div className="flex items-center gap-2 ml-5">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {getUserEmail(order.user)}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <span className="text-sm text-gray-600">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </span>
                </TableCell>
                <TableCell className="px-6">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      order.status
                    )} inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {formatOrderStatus(order.status)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6">
                  <Badge
                    variant="outline"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      order.isPaid
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10"
                        : "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        order.isPaid ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {getPaymentMethodDisplay(order.paymentMethod)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {getTotalItems(order.orderItems)}
                  </span>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <span className="text-sm text-gray-900">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <span className="text-sm text-gray-600">
                    ${order.taxPrice.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <span className="text-sm text-gray-600">
                    ${order.shippingPrice.toFixed(2)}
                  </span>
                </TableCell>
                {orders.some((o) => o.discountAmount > 0) && (
                  <TableCell className="px-6 text-right">
                    {order.discountAmount > 0 ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-medium text-red-600">
                          -${order.discountAmount.toFixed(2)}
                        </span>
                        {order.discount && (
                          <Badge variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {order.discount.code}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="px-6 text-right">
                  <span className="font-semibold text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="px-6 text-center">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                  >
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
  );
}
