"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  canCancelOrder,
  formatOrderStatus,
  useCancelOrder,
  useMyOrders,
  useUserOrderStats,
} from "@/hooks/use-orders";
import { cn } from "@/lib/utils";
import { Order, OrderStatus } from "@/types/order";
import { Product } from "@/types/product";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  Loader2,
  MapPin,
  Package,
  PackageCheck,
  RefreshCcw,
  Search,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Helper function to get status color (moved outside component)
function getOrderStatusColor(status: string) {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-50",
    processing: "text-blue-600 bg-blue-50",
    shipped: "text-purple-600 bg-purple-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    refunded: "text-orange-600 bg-orange-50",
    "on-hold": "text-gray-600 bg-gray-50",
    failed: "text-red-700 bg-red-100",
    completed: "text-emerald-600 bg-emerald-50",
  };

  return statusColors[status] || "text-gray-600 bg-gray-50";
}

// Helper function to extract product ID
function getProductId(product: Product | string): string {
  if (typeof product === "string") {
    return product;
  }
  if (product && typeof product === "object" && product._id) {
    return product._id;
  }
  return "";
}

export default function Page() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, error } = useMyOrders({
    page,
    limit: 10,
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(searchQuery && { keyword: searchQuery }),
  });

  const { data: statsData, isLoading: statsLoading } = useUserOrderStats();
  const stats = statsData?.data;

  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;

  const handleCancelClick = (order: Order) => {
    setSelectedOrder(order);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!selectedOrder) return;

    cancelOrder(
      { orderId: selectedOrder._id, data: { reason: cancelReason } },
      {
        onSuccess: () => {
          setCancelDialogOpen(false);
          setSelectedOrder(null);
          setCancelReason("");
        },
      }
    );
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
      case "failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Spent",
      value: `$${stats?.totalSpent?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Completed",
      value: stats?.completedOrders || 0,
      icon: PackageCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Average Order",
      value: `$${stats?.averageOrderValue?.toFixed(2) || "0.00"}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            My Orders
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track and manage your order history
          </p>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, idx) => (
              <Card
                key={idx}
                className="bg-white border border-gray-200 rounded-none shadow-none p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-full", stat.bgColor)}>
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Filters */}
        <Card className="bg-white border border-gray-200 rounded-none shadow-none p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-none h-10 border-gray-300 focus-visible:ring-gray-400"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as OrderStatus | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-[200px] rounded-none h-10 border-gray-300">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="flex flex-col items-center justify-center py-20 sm:py-32 bg-white border border-gray-200 rounded-none shadow-none">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping" />
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              </div>
            </div>
            <p className="text-gray-900 font-semibold text-base sm:text-lg mt-6">
              Loading your orders...
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              This will only take a moment
            </p>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="flex flex-col items-center justify-center py-20 sm:py-32 bg-white border border-gray-200 rounded-none shadow-none">
            <div className="bg-red-50 rounded-full p-6 mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load orders
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center max-w-md px-4">
              {error.message ||
                "Something went wrong while fetching your orders"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-none bg-gray-900 hover:bg-gray-800"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-20 sm:py-32 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-none shadow-none">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gray-300 rounded-full opacity-20 animate-pulse" />
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              {searchQuery || statusFilter !== "all"
                ? "No orders found"
                : "No orders yet"}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 text-center max-w-md px-4 leading-relaxed">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters to find what you're looking for"
                : "Start shopping to see your orders appear here. Browse our collection and find something you love!"}
            </p>
            <Button
              asChild
              className="rounded-none bg-gray-900 hover:bg-gray-800 font-semibold"
            >
              <Link href="/products">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </Card>
        )}

        {/* Orders List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              // Get the status color using the helper function
              const statusColorClass = getOrderStatusColor(order.status);

              return (
                <Card
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-none shadow-none hover:shadow-md transition-all duration-200"
                >
                  <div className="p-5 sm:p-6">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                            Order Number
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {order.orderNumber}
                          </p>
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-gray-200" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                            Order Date
                          </p>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <p className="text-sm text-gray-900">
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
                        </div>
                        <div className="hidden sm:block h-10 w-px bg-gray-200" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">
                            Total Amount
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          statusColorClass,
                          "rounded-none font-semibold px-3 py-1.5 text-xs uppercase tracking-wide"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {formatOrderStatus(order.status)}
                        </span>
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.orderItems.slice(0, 3).map((item, idx) => {
                          // Extract product ID safely
                          const productId = getProductId(item.product);

                          return (
                            <Link
                              key={idx}
                              href={productId ? `/products/${productId}` : "#"}
                              className="flex items-center gap-4 group hover:bg-gray-50 p-2 -mx-2 rounded transition-colors"
                            >
                              <div className="w-20 h-20 bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                                <Image
                                  src={item.image || "/placeholder.png"}
                                  alt={item.name}
                                  width={80}
                                  height={80}
                                  className="object-contain p-2"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1 mb-1">
                                  {item.name}
                                </p>
                                {item.variation && (
                                  <div className="flex flex-wrap gap-2 mb-1">
                                    {item.variation.size && (
                                      <span className="text-xs text-gray-500">
                                        Size: {item.variation.size}
                                      </span>
                                    )}
                                    {item.variation.color && (
                                      <span className="text-xs text-gray-500">
                                        Color: {item.variation.color}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                  <span className="font-medium">
                                    Qty: {item.quantity}
                                  </span>
                                  <span>×</span>
                                  <span className="font-semibold text-gray-900">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  <span className="ml-auto font-semibold text-gray-900">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                        {order.orderItems.length > 3 && (
                          <p className="text-xs text-gray-500 pl-24 font-medium">
                            + {order.orderItems.length - 3} more item(s)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Shipping & Payment Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
                      <div className="bg-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                            Shipping Address
                          </h4>
                        </div>
                        <div className="text-sm text-gray-700 space-y-0.5">
                          <p>{order.shippingAddress.address}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                          {order.shippingAddress.phoneNumber && (
                            <p className="text-xs text-gray-500 mt-2">
                              {order.shippingAddress.phoneNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="h-4 w-4 text-gray-600" />
                          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                            Payment Details
                          </h4>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p className="font-medium">{order.paymentMethod}</p>
                          <p
                            className={cn(
                              "text-xs font-semibold",
                              order.isPaid
                                ? "text-green-600"
                                : "text-orange-600"
                            )}
                          >
                            {order.isPaid ? "✓ Paid" : "⏳ Pending Payment"}
                          </p>
                          {order.isPaid && order.paidAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Paid on{" "}
                              {new Date(order.paidAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.shipping?.trackingNumber && (
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-5">
                        <div className="flex items-start gap-3">
                          <Truck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-1">
                              Tracking Information
                            </h4>
                            <p className="text-sm text-blue-700 mb-1">
                              <span className="font-medium">Carrier:</span>{" "}
                              {order.shipping.carrier}
                            </p>
                            <p className="text-sm text-blue-700 font-mono">
                              <span className="font-medium">Tracking #:</span>{" "}
                              {order.shipping.trackingNumber}
                            </p>
                            {order.shipping.estimatedDeliveryDate && (
                              <p className="text-xs text-blue-600 mt-2">
                                Estimated delivery:{" "}
                                {new Date(
                                  order.shipping.estimatedDeliveryDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-none flex-1 sm:flex-initial border-gray-300 hover:bg-gray-50"
                      >
                        <Link href={`/orders/${order._id}`}>
                          View Full Details
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      {canCancelOrder(order) && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancelClick(order)}
                          className="rounded-none flex-1 sm:flex-initial text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-white border border-gray-200 p-4 rounded-none">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-none w-full sm:w-auto"
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(pagination.totalPages)]
                .map((_, idx) => (
                  <Button
                    key={idx}
                    variant={page === idx + 1 ? "default" : "outline"}
                    onClick={() => setPage(idx + 1)}
                    className={cn(
                      "rounded-none w-10 h-10 p-0",
                      page === idx + 1 && "bg-gray-900 hover:bg-gray-800"
                    )}
                  >
                    {idx + 1}
                  </Button>
                ))
                .slice(
                  Math.max(0, page - 3),
                  Math.min(pagination.totalPages, page + 2)
                )}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="rounded-none w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Cancel Order
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Are you sure you want to cancel order{" "}
              <span className="font-semibold text-gray-900">
                {selectedOrder?.orderNumber}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for cancellation{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Let us know why you're cancelling this order..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="resize-none text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
              disabled={isCancelling}
              className="rounded-none"
            >
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={isCancelling}
              className="rounded-none"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
