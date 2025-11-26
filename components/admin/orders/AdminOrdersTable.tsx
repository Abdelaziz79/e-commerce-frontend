// components/admin/orders/AdminOrdersTable.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CreditCard, Loader2, Mail, Package, Tag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OrderRowActions } from "./OrderRowActions";

interface AdminOrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

export function AdminOrdersTable({ orders, isLoading }: AdminOrdersTableProps) {
  const getStatusColor = useOrderStatusColor;
  const [sortBy, setSortBy] = useState<"date" | "total" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case "total":
        comparison = a.totalPrice - b.totalPrice;
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Calculate totals for current page
  const pageTotals = orders.reduce(
    (acc, order) => {
      acc.subtotal += order.subtotal;
      acc.tax += order.taxPrice;
      acc.shipping += order.shippingPrice;
      acc.discount += order.discountAmount;
      acc.total += order.totalPrice;
      return acc;
    },
    { subtotal: 0, tax: 0, shipping: 0, discount: 0, total: 0 }
  );

  const hasDiscounts = orders.some((o) => o.discountAmount > 0);

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      {!isLoading && orders.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(value: "date" | "total" | "status") =>
              setSortBy(value)
            }
          >
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="total">Total Amount</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="h-9 gap-2"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                {hasDiscounts && (
                  <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
                    Discount
                  </TableHead>
                )}
                <TableHead className="h-11 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider text-right">
                  Total
                </TableHead>
                <TableHead className="h-11 w-[70px] text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={hasDiscounts ? 13 : 12}
                    className="text-center h-64"
                  >
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
              {!isLoading && sortedOrders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={hasDiscounts ? 13 : 12}
                    className="text-center h-64"
                  >
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
                sortedOrders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="group hover:bg-gray-50/50 transition-all duration-150 border-b border-gray-100 last:border-0"
                  >
                    <TableCell className="py-4 px-6">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
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
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-gray-900">
                          {format(new Date(order.createdAt), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(order.createdAt), "h:mm a")}
                        </span>
                      </div>
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
                    {hasDiscounts && (
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
                      <OrderRowActions order={order} />
                    </TableCell>
                  </TableRow>
                ))}

              {/* Totals Row */}
              {!isLoading && sortedOrders.length > 0 && (
                <TableRow className="bg-gray-50 border-t-2 border-gray-200 font-semibold">
                  <TableCell
                    colSpan={7}
                    className="px-6 py-4 text-right text-sm text-gray-700"
                  >
                    Page Totals:
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm text-gray-900">
                    ${pageTotals.subtotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm text-gray-900">
                    ${pageTotals.tax.toFixed(2)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm text-gray-900">
                    ${pageTotals.shipping.toFixed(2)}
                  </TableCell>
                  {hasDiscounts && (
                    <TableCell className="px-6 py-4 text-right text-sm text-red-600">
                      -${pageTotals.discount.toFixed(2)}
                    </TableCell>
                  )}
                  <TableCell className="px-6 py-4 text-right text-sm text-gray-900 font-bold">
                    ${pageTotals.total.toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
